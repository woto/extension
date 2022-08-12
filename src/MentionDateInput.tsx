import Alert from './Alert';
import { EntityAction, Kind } from "../main";
import _ from "lodash";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { Menu, Transition } from '@headlessui/react'
import React, { Dispatch, useEffect, useReducer, useState } from 'react';
import dayjs from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isToday from 'dayjs/plugin/isToday';
import utc from 'dayjs/plugin/utc';
import { EntityActionType } from './Utils';

dayjs.extend(weekOfYear);
dayjs.extend(isToday);
dayjs.extend(utc);

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const initialState = {
  year: dayjs().year(),
  month: dayjs().month()
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'increment':
      if (state.month === 11) {
        return {
          year: state.year + 1,
          month: 0
        }
      } else {
        return {
          year: state.year,
          month: state.month + 1
        }
      }
    case 'decrement':
      if (state.month === 0) {
        return {
          year: state.year - 1,
          month: 11
        }
      } else {
        return {
          year: state.year,
          month: state.month - 1
        }
      }
    default:
      throw new Error();
  }
}

function MentionDateInput(props: {
  mentionDate: Date | null | undefined,
  setMentionDate: React.Dispatch<React.SetStateAction<Date | null | undefined>>
  toggleVisibility: any,
  priority: number,
  show: boolean,
}) {

  const [state, dispatch] = useReducer(reducer, initialState);

  type CalendarDay = {
    date: Date,
    isCurrentMonth: boolean,
    isToday: boolean,
    isSelected: boolean
  }

  const [days, setDays] = useState<CalendarDay[]>([])

  const setMentionDate = (mentionDate: Date) => {
    let newMentionDate: Date | null = null;

    if (dayjs(props.mentionDate).isSame(mentionDate)) {
      newMentionDate = null;
    } else {
      newMentionDate = mentionDate;
    }

    props.setMentionDate(newMentionDate);

    // props.dispatch({ type: EntityActionType.SET_MENTION_DATE, payload: { mentionDate: mentionDate } })
  }

  useEffect(() => {
    const firstDayOfMonth = dayjs(new Date(state.year, state.month, 0)).day()
    let currentMonthCount = 0 - firstDayOfMonth;
    let days: CalendarDay[] = [];

    const date1 = dayjs(props.mentionDate);

    new Array(6).fill([]).map(() => {
      new Array(7).fill(null).map(() => {
        currentMonthCount++;
        const date = new Date(Date.UTC(state.year, state.month, currentMonthCount));
        const date2 = dayjs(date)
        days.push({
          date: date, //`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
          isCurrentMonth: date.getMonth() === state.month,
          isToday: dayjs(date).isToday(),
          isSelected: date1.isSame(date2)
        })
        // dayjs(new Date(year, month, currentMonthCount))
      })
    })

    for (let i = 0; i < 2; i++) {
      if (days.slice(-7).every((day) => day.isCurrentMonth == false)) {
        days = days.slice(0, -7);
      }
    }

    setDays(days);
  }, [state.month, props.mentionDate])

  const monthInLocale = (month: number) => {
    var date = new Date();
    date.setDate(1);
    date.setMonth(month);
    const str = date.toLocaleString('ru-RU', { month: "long" });
    return _.startCase(str);
  }

  return (
    <div className={`relative priority-${props.priority * 10}`}>
      <Transition
        show={props.show}
        enter="transition-all duration-300"
        enterFrom="max-h-0 opacity-0 mt-0"
        enterTo="max-h-[500px] opacity-100 mt-3"
        leave="transition-all duration-300"
        leaveFrom="max-h-[500px] opacity-100 mt-3"
        leaveTo="max-h-0 opacity-0 mt-0"
      >

        <Alert toggleVisibility={(e: any) => props.toggleVisibility(e, 'mentionDate')}
          title={"Дата"}
          text={"Например дата статьи в которой упоминается объект или дата комментария."} />


        <div>
          <div className="flex items-center">
            <div className="flex-auto text-sm font-semibold text-gray-900">{monthInLocale(state.month)} {state.year}</div>
            <button
              onClick={() => dispatch({ type: 'decrement' })}
              type="button"
              className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => dispatch({ type: 'increment' })}
              type="button"
              className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
            <div>Пн</div>
            <div>Вт</div>
            <div>Ср</div>
            <div>Чт</div>
            <div>Пт</div>
            <div>Сб</div>
            <div>Вс</div>
          </div>
          <div className="mt-2 grid grid-cols-7 text-sm bg-white rounded-md shadow ring-1 ring-gray-200">
            {days && days.map((day, dayIdx) => (
              <div key={day.date.toLocaleDateString("en-US")}
                className={classNames(dayIdx > 6 && 'border-t border-gray-200', 'py-2')}>
                <button
                  onClick={() => setMentionDate(day.date)}
                  type="button"
                  className={classNames(
                    day.isSelected && 'text-white',
                    !day.isSelected && day.isToday && 'text-indigo-600',
                    !day.isSelected && !day.isToday && day.isCurrentMonth && 'text-gray-900',
                    !day.isSelected && !day.isToday && !day.isCurrentMonth && 'text-gray-400',
                    day.isSelected && day.isToday && 'bg-indigo-600',
                    day.isSelected && !day.isToday && 'bg-gray-600',
                    !day.isSelected && 'hover:bg-gray-200',
                    (day.isSelected || day.isToday) && 'font-semibold',
                    'mx-auto flex h-7 w-7 items-center justify-center rounded-full'
                  )}
                >
                  {/*<time dateTime={day.date.toString()}>{day.date.toString().replace(/^0/, '')}</time>*/}
                  <time dateTime={day.date.getDate().toString()}>{day.date.getDate().toString().replace(/^0/, '')}</time>
                </button>
              </div>
            ))}
          </div>
        </div>

      </Transition>
    </div>
  );
}

export default React.memo(MentionDateInput);
