import React, { useRef } from 'react';
import Toolbar from './EditorToolbar';

export default function Editor() {
  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        {/*  툴바 컴포넌트 */}
        <Toolbar editorRef={editorRef} />
      </div>

      <div
        ref={editorRef}
        contentEditable
        style={{
          minHeight: '300px',
          border: '1px solid #ccc',
          padding: '1rem',
        }}
      >
        여기에 글을 입력하거나 드래그해서 제목으로 변환해보세요.
      </div>
    </div>
  );
}
