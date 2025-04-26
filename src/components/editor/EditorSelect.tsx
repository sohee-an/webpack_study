import React from 'react';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
type EditorToolbarProps = {
  onChange: (format: 'p' | 'h1' | 'h2' | 'h3') => void;
};

const HEADING_LIST = [
  { label: '본문', value: 'p' },
  { label: '제목 1', value: 'h1' },
  { label: '제목 2', value: 'h2' },
  { label: '제목 3', value: 'h3' },
] as const;

export default function EditorSelect({ onChange }: EditorToolbarProps) {
  return (
    <div className="w-40 mb-4 ">
      <Select onValueChange={(value) => onChange(value as 'p' | 'h1' | 'h2' | 'h3')}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="제목" />
        </SelectTrigger>
        <SelectContent className="bg-white ">
          {HEADING_LIST.map((item) => (
            <SelectItem className="hover:bg-gray-200" key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
