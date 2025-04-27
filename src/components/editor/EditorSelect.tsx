import React from 'react';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

type EditorToolbarProps = {
  onChange: (value: keyof HTMLElementTagNameMap) => void;
};
const HEADING_LIST = [
  { label: '본문', value: 'p' },
  { label: '제목 1', value: 'h1' },
  { label: '제목 2', value: 'h2' },
  { label: '제목 3', value: 'h3' },
] as const;

export default function EditorSelect({ onChange }: EditorToolbarProps) {
  return (
    <div>
      <Select onValueChange={(value) => onChange(value as keyof HTMLElementTagNameMap)}>
        <SelectTrigger className="w-[100px] h-full">
          <SelectValue placeholder="본문" />
        </SelectTrigger>
        <SelectContent>
          {HEADING_LIST.map((item) => (
            <SelectItem className="hover:bg-gray-200 bg-white" key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
