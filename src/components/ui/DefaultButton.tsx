import * as React from 'react';
import clsx from 'clsx';

type ButtonElement = React.ElementRef<'button'>;
type DefaultButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

const Button = React.forwardRef<ButtonElement, DefaultButtonProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <button ref={ref} className={clsx(className)} {...rest}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
export type { DefaultButtonProps };
