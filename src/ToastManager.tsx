import React, { MouseEventHandler } from "react";
import { ToastContextInterface, ToastType } from "../main";
import Toast from "./Toast";
import { motion } from "framer-motion";

const Ctx = React.createContext<ToastContextInterface>({ add: null, remove: null });

// Styled Components
// ==============================

const ToastContainer = (props: { children: React.ReactNode }) => (
  <div
    aria-live="assertive"
    className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
  >
    <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
      {props.children}
    </div>
  </div>
);

// const TmpToast = (props: { children: React.ReactNode, onDismiss: MouseEventHandler<HTMLDivElement> | undefined }) => (
//   <div
//     style={{
//       background: "LemonChiffon",
//       cursor: "pointer",
//       fontSize: 14,
//       margin: 10,
//       padding: 10,
//       display: 'flex'
//     }}
//     onClick={props.onDismiss}
//   >
//     <Toast></Toast>
//     {props.children}
//   </div>
// );

// Provider
// ==============================

let toastCount = 0;

export function ToastProvider(props: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastType[]>([]);

  const add = (content: string) => {
    const id = toastCount++;
    const toast = { content, id };
    setToasts((prevToasts) => [...prevToasts, toast]);
  };

  const remove = (id: number) => {
    const newToasts = toasts.filter((t: ToastType) => t.id !== id);
    setToasts(newToasts);
  };

  // avoid creating a new fn on every render
  const onDismiss = (id: number) => () => remove(id);

  return (
    <Ctx.Provider value={{ add, remove }}>
      {props.children}
      <ToastContainer>
        {toasts.map(({ content, id, ...rest }) => (
          <Toast key={id} onDismiss={onDismiss(id)} {...rest}>
            <div className="ml-3 font-medium flex-1 pt-0.5 text-sm text-gray-900">
              {content}
            </div>
          </Toast>
        ))}
      </ToastContainer>
    </Ctx.Provider>
  );
}

// Consumer
// ==============================

export const useToasts = () => React.useContext(Ctx);
