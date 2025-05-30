import React from 'react';
import clsx from 'clsx';

type DividerProps = {
  orientation?: 'vertical' | 'horizontal';
  width?: string; // e.g., '1px', '4px'
  height?: string; // e.g., '100%', '1rem'
  color?: string; // e.g., 'bg-gray-400'
  className?: string;
};

export function Divider({
  orientation = 'vertical',
  width,
  height,
  color = 'bg-gray-400',
  className,
}: DividerProps) {
  const isVertical = orientation === 'vertical';

  const finalWidth = isVertical ? (width ?? '1px') : '100%';
  const finalHeight = isVertical ? '100%' : (height ?? '1px');

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={clsx(color, className)}
      style={{
        width: finalWidth,
        height: finalHeight,
        flexShrink: 0,
      }}
    />
  );
}
