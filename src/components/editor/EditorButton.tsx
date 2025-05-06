import React from 'react';
import clsx from 'clsx';
import { Button } from '@radix-ui/themes';

type TProps = {
  onClick?: () => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  disable?: boolean;
  className?: string;
};

export default function EditorButton({ onClick, children, onMouseDown, className }: TProps) {
  return (
    <Button
      onClick={onClick}
      onMouseDown={onMouseDown}
      className={clsx(
        'h-full flex items-center justify-center px-2 py-1 min-w-[32px] min-h-[32px] font-bold border rounded hover:bg-gray-100',
        className,
      )}
    >
      {children}
    </Button>
  );
}
