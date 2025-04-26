import React from 'react';
import EditorSelect from './editor/EditorSelect';

type EditorToolbarProps = {
  onChange: (format: 'p' | 'h1' | 'h2' | 'h3') => void;
};

export default function EditorToolbar({ onChange }: EditorToolbarProps) {
  return (
    <div className="w-40 mb-4 ">
      <EditorSelect onChange={onChange} />
    </div>
  );
}
