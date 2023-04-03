import React, {
  MouseEventHandler, ReactNode, useCallback, useMemo,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastContextInterface, ToastType } from '../main';
import Toast from './Toast';

const Ctx = React.createContext({} as ToastContextInterface);

function ToastContainer(props: { children: React.ReactNode }) {
  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {props.children}
      </div>
    </div>
  );
}

let toastCount = 0;

export function ToastProvider(props: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastType[]>([]);

  const add = useCallback((content: string | ReactNode) => {
    toastCount += 1;
    const id = toastCount;
    const toast = { content, id };
    setToasts((prevToasts) => [...prevToasts, toast]);
  }, []);

  const remove = useCallback((id: number) => {
    const newToasts = toasts.filter((t: ToastType) => t.id !== id);
    setToasts(newToasts);
  }, [toasts]);

  const value = useMemo(() => ({ add, remove }), [add, remove]);

  return (
    <Ctx.Provider value={value}>
      {props.children}
      <ToastContainer>
        <AnimatePresence>
          {toasts.map(({ content, id }) => (
            <Toast key={id} id={id} remove={remove}>
              <div className="ml-3 font-medium flex-1 pt-0.5 text-sm text-gray-900">
                {content}
              </div>
            </Toast>
          ))}
        </AnimatePresence>
      </ToastContainer>
    </Ctx.Provider>
  );
}

// Consumer
// ==============================

export const useToasts = () => React.useContext(Ctx);
