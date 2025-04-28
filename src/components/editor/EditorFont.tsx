import React from 'react';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
// type EditorToolbarProps = {
//   onChange: (format: string) => void;
// };

const FONT_SIZE_LIST = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '32px', value: '32px' },
] as const;

export default function EditorFont() {
  const applyFontSize = React.useCallback((size: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    const span = document.createElement('span');
    span.style.fontSize = size;
    span.textContent = selectedText;

    range.deleteContents();
    range.insertNode(span);

    range.setStartAfter(span);
    range.setEndAfter(span);
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  return (
    <div className="w-20 mb-4">
      <Select onValueChange={(value) => applyFontSize(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="글자 크기 선택" />
        </SelectTrigger>
        <SelectContent>
          {FONT_SIZE_LIST.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
