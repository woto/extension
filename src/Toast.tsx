import React, { MouseEventHandler, useEffect } from 'react';
/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import {
  AnimatePresence,
  motion,
  useAnimation,
  useAnimationControls,
} from 'framer-motion';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      opacity: { duration: 1 },
      pathLength: { duration: 5, bounce: 0 },
    },
  },
};

export default function Toast(props: {
  children: React.ReactNode;
  onDismiss: MouseEventHandler<HTMLDivElement> | undefined;
}) {
  const [show, setShow] = useState(true);
  const [showCircle, setShowCircle] = useState(false);

  const controls = useAnimationControls();

  useEffect(() => {
    controls.start('visible');
  }, [showCircle]);

  return (
    <Transition
      afterEnter={() => {
        setShowCircle(true);
      }}
      appear
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        onMouseEnter={() => {
          controls.stop();
        }}
        onMouseLeave={() => {
          controls.start('visible');
        }}
        className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
      >
        <div className="p-4">
          <div className="flex items-center">
            {props.children}

            <div className="ml-4 relative p-1 flex-shrink-0 flex">
              <button
                className="bg-white rounded-full inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  setShow(false);
                }}
              >
                <AnimatePresence>
                  {showCircle && (
                    <svg
                      className="h-16 w-16 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
                      viewBox="0 0 40 40"
                    >
                      <circle
                        className="stroke-2 stroke-sky-50 fill-transparent"
                        cx="20"
                        cy="20"
                        r="10"
                      />

                      <motion.circle
                        onAnimationComplete={() => setShow(false)}
                        className="stroke-2 stroke-sky-300 fill-transparent"
                        cx="20"
                        cy="20"
                        r="10"
                        initial="hidden"
                        animate={controls}
                        variants={draw}
                      />
                    </svg>
                  )}
                </AnimatePresence>

                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
