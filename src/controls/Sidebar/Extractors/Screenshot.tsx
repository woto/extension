import React, {
  MouseEventHandler,
  ReactChildren,
  ReactNode,
  SyntheticEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import { GlobalContext } from '../../../Utils';
import WidgetPortal from '../../../WidgetPortal';

export default function Screenshot(props: {
  refetchClicked: boolean;
  setRefetchClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const globalContext = useContext(GlobalContext);
  const [rectangle, setRectangle] = useState<{
      top: number;
      right: number;
      bottom: number;
      left: number;
      width: number;
      height: number;
    }>();
  const [initialPosition, setInitialPosition] = useState<{ top: number; left: number }>();
  const [currentPosition, setCurrentPosition] = useState<{ top: number; left: number }>();
  const [originalOverflow, setOriginalOverflow] = useState<{ html: string; body: string }>();
  const [choosingArea, setChoosingArea] = useState<boolean>(false);
  const [adjustingArea, setAdjustingArea] = useState<boolean>(false);
  const [showCrosshair, setShowCrosshair] = useState<boolean>(false);
  const [image, setImage] = useState<string>();
  const finishButtonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const nodeRef = React.useRef<HTMLDivElement>(null);
  const topRef = React.useRef<HTMLDivElement>(null);
  const rightRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const leftRef = React.useRef<HTMLDivElement>(null);

  const hideScrollbars = () => {
    // setOriginalOverflow({ html: document.body.style.overflow, body: document.documentElement.style.overflow });
    // document.body.style.overflow = 'hidden';
    // document.documentElement.style.overflow = 'hidden';
  };

  const showScrollbars = () => {
    // if (originalOverflow) document.body.style.overflow = originalOverflow.body;
    // if (originalOverflow) document.documentElement.style.overflow = originalOverflow.html;
    // setOriginalOverflow(undefined);
  };

  const handleTakeScreenshot = (e: any) => {
    setImage(undefined);
    setChoosingArea(true);
    globalContext.setCollapseWindow(true);
    hideScrollbars();
    setShowCrosshair(true);
  };

  useEffect(() => {
    if (!adjustingArea && initialPosition && currentPosition) {
      setRectangle({
        top:
          currentPosition.top > initialPosition.top
            ? initialPosition.top
            : currentPosition.top,
        right:
          currentPosition.left > initialPosition.left
            ? window.visualViewport!.width - currentPosition.left
            : window.visualViewport!.width - initialPosition.left,
        bottom:
          currentPosition.top > initialPosition.top
            ? window.visualViewport!.height - currentPosition.top
            : window.visualViewport!.height - initialPosition.top,
        left:
          currentPosition.left > initialPosition.left
            ? initialPosition.left
            : currentPosition.left,
        width: Math.abs(currentPosition.left - initialPosition.left),
        height: Math.abs(currentPosition.top - initialPosition.top),
      });
    }
  }, [initialPosition, currentPosition]);

  const handleMouseDown = (e: any) => {
    if (e.target === finishButtonRef.current) return;

    setInitialPosition({ top: e.clientY, left: e.clientX });
    setCurrentPosition({ top: e.clientY, left: e.clientX });
    setAdjustingArea(false);
  };

  const makeScreenshot = (rectangle: any) => {
    chrome.runtime.sendMessage(
      {
        message: 'take-screenshot',
        coordinates: {
          x: rectangle.left,
          y: rectangle.top,
          width: rectangle.width,
          height: rectangle.height,
        },
      },
      ({ imageUri }: { imageUri: string }) => {
        const canvas = document.getElementById('canvas');
        if (!canvasRef.current) return;

        canvasRef.current.width = rectangle.width;
        canvasRef.current.height = rectangle.height;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = function () {
          ctx.drawImage(
            img,
            rectangle.left,
            rectangle.top,
            rectangle.width,
            rectangle.height,
            0,
            0,
            rectangle.width,
            rectangle.height,
          );
          if (!canvasRef.current) return;

          const base64 = canvasRef.current.toDataURL();
          setImage(base64);
        };
        img.src = imageUri;
      },
    );
  };

  useEffect(() => {
    if (image) {
      setAdjustingArea(false);

      showScrollbars();
      setChoosingArea(false);
      globalContext.setCollapseWindow(false);

      setInitialPosition(undefined);
      setCurrentPosition(undefined);
      setRectangle(undefined);
    }
  }, [image]);

  const handleFinish = (e: any) => {
    makeScreenshot(rectangle);
  };

  const handleMouseUp = (e: any) => {
    setAdjustingArea(true);
  };

  const handleMouseMove = (e: any) => {
    setCurrentPosition({ top: e.clientY, left: e.clientX });
  };

  return (
    <>
      <button
        onClick={handleTakeScreenshot}
        type="button"
        className="mt-3 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded
        text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Сделать скриншот
      </button>

      <canvas className="hidden" ref={canvasRef} />

      {image && <img className="mt-3 border rounded" src={image} />}

      {choosingArea && (
        <WidgetPortal>
          {showCrosshair && (
            <>
              <div
                className="fixed w-full h-[3px] bg-white/10 backdrop-invert drag-none select-none"
                style={{
                  top: (currentPosition && currentPosition.top - 1) || -999,
                  left: 0,
                }}
              />
              <div
                className="fixed h-full w-[3px] bg-white/10 backdrop-invert drag-none select-none"
                style={{
                  top: 0,
                  left: (currentPosition && currentPosition.left - 1) || -999,
                }}
              />
            </>
          )}

          <div
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            className="will-change-auto fixed inset-0 cursor-crosshair drag-none select-none"
          >
            {rectangle
              && rectangle.top
              && rectangle.right
              && rectangle.bottom
              && rectangle.left && (
                <>
                  <div
                    className="fixed border-2 -m-3 rounded-lg border-slate-50 border-dashed z-20"
                    style={{
                      top: rectangle.top,
                      right: rectangle.right,
                      bottom: rectangle.bottom,
                      left: rectangle.left,
                    }}
                  >
                    {adjustingArea && (
                      <div
                        className={`absolute translate-x-full drag-none select-none
                      ${
                        rectangle
                        && currentPosition
                        && currentPosition.top
                          > rectangle.top + rectangle.height / 2
                          ? '-mb-1 bottom-0 translate-y-full'
                          : '-mt-1 top-0 -translate-y-full'
                      }
                      ${
                        rectangle
                        && currentPosition
                        && currentPosition.left
                          > rectangle.left + rectangle.width / 2
                          ? '-mr-1 right-0'
                          : '-ml-1 -translate-x-full'
                      }
                    `}
                      >
                        <button
                          onMouseOver={() => setShowCrosshair(false)}
                          onMouseLeave={() => setShowCrosshair(true)}
                          ref={finishButtonRef}
                          onClick={handleFinish}
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Ok
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    className="bg-black/50 fixed drag-none select-none"
                    style={{
                      top: 0,
                      right: rectangle.right,
                      bottom: rectangle.bottom + rectangle.height,
                      left: 0,
                    }}
                    ref={topRef}
                  />
                  <div
                    className="bg-black/50 fixed drag-none select-none"
                    style={{
                      top: 0,
                      right: 0,
                      bottom: rectangle.bottom,
                      left: rectangle.left + rectangle.width,
                    }}
                    ref={rightRef}
                  />
                  <div
                    className="bg-black/50 fixed drag-none select-none"
                    style={{
                      top: rectangle.top + rectangle.height,
                      right: 0,
                      bottom: 0,
                      left: rectangle.left,
                    }}
                    ref={bottomRef}
                  />
                  <div
                    className="bg-black/50 fixed drag-none select-none"
                    style={{
                      top: rectangle.top,
                      right: rectangle.right + rectangle.width,
                      bottom: 0,
                      left: 0,
                    }}
                    ref={leftRef}
                  />
                </>
            )}
          </div>
        </WidgetPortal>
      )}
    </>
  );
}
