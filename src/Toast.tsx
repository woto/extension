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
      pathLength: { duration: 10, bounce: 0 },
    },
  },
};

export default function Toast(props: {
  children: React.ReactNode,
  remove: (id: number) => void,
  id: number,
}) {
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
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
              type="button"
              className="bg-white rounded-full inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                props.remove(props.id);
              }}
            >
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
                  onAnimationComplete={() => props.remove(props.id)}
                  className="stroke-2 stroke-sky-300 fill-transparent"
                  cx="20"
                  cy="20"
                  r="10"
                  initial="hidden"
                  animate={controls}
                  variants={draw}
                />
              </svg>

              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
