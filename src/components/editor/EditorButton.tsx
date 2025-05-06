import React from 'react';
import clsx from 'clsx';
import { Button } from '../ui/DefaultButton';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

const EditorButton = React.forwardRef<React.ElementRef<'button'>, ButtonProps>(
  ({ onClick, className, children, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
        onClick={onClick}
        className={clsx(
          'h-full flex items-center justify-center px-2 py-1 bg-white min-w-[34px] min-h-[32px] font-bold border rounded hover:bg-gray-100',
          className,
        )}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

/** React DevTools, 에러 메시지, Stack Trace 등에서 정확한 이름으로 보여줌 */
EditorButton.displayName = 'EditorButton';

export { EditorButton };
export type { ButtonProps };
