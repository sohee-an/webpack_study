import React, { useRef } from 'react';
import EditorToolbar from './EditorToolbar';

export default function Editor() {
  const editorRef = useRef<HTMLDivElement>(null);

  const applyFormat = (format: 'h1' | 'h2' | 'h3' | 'p') => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    const element = document.createElement(format);
    element.textContent = selectedText;

    range.deleteContents();
    range.insertNode(element);

    range.setStartAfter(element);
    range.setEndAfter(element);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        {/* ✅ 툴바 컴포넌트 */}
        <EditorToolbar onChange={applyFormat} />
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
