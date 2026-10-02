import { useRef, useCallback } from "react";

interface Position {
  x: number;
  y: number;
}

interface UseLongPressOptions {
  onLongPress: (pos: Position) => void;
  onClick?: () => void;
  delay?: number; // ms, default 500ms
  moveThreshold?: number; // px, default 10px
}

export function useLongPress({
  onLongPress,
  onClick,
  delay = 500,
  moveThreshold = 10
}: UseLongPressOptions) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startPosRef = useRef<Position | null>(null);
  const isLongPressRef = useRef(false);

  const start = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      // If it's a mouse right-click or middle click, don't handle as long press
      if ("button" in e && e.button !== 0) return;

      isLongPressRef.current = false;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      startPosRef.current = { x: clientX, y: clientY };

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        if (startPosRef.current) {
          onLongPress({ x: startPosRef.current.x, y: startPosRef.current.y });
          // Subtle haptic feedback if supported on mobile devices
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            try {
              navigator.vibrate(15);
            } catch {
              // Ignore vibration errors
            }
          }
        }
      }, delay);
    },
    [onLongPress, delay]
  );

  const move = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!startPosRef.current || !timerRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = Math.abs(clientX - startPosRef.current.x);
      const deltaY = Math.abs(clientY - startPosRef.current.y);

      // If moved beyond threshold (e.g. user is scrolling), cancel long press
      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    },
    [moveThreshold]
  );

  const end = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      startPosRef.current = null;

      if (isLongPressRef.current) {
        // Prevent accidental short click / tap if long press just fired
        if ("preventDefault" in e && e.cancelable) {
          e.preventDefault();
        }
        isLongPressRef.current = false;
      } else if (onClick) {
        onClick();
      }
    },
    [onClick]
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startPosRef.current = null;
    isLongPressRef.current = false;
  }, []);

  return {
    onTouchStart: start,
    onTouchMove: move,
    onTouchEnd: end,
    onTouchCancel: cancel,
    onMouseDown: start,
    onMouseMove: move,
    onMouseUp: end,
    onMouseLeave: cancel
  };
}
