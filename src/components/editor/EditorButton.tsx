import React from 'react';
import { Button } from '@radix-ui/themes';

type TProps = {
  onClick: () => void;
  children: React.ReactNode;
};

export default function EditorButton({ onClick, children }: TProps) {
  return (
    <Button
      onClick={onClick}
      className={`h-full flex items-center justify-center px-2 py-1 font-bold border rounded hover:bg-gray-100`}
    >
      {children}
    </Button>
  );
}
