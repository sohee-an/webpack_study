import React from 'react';
import { Button } from '@/components/ui/button';
import { useEditorUtils } from '@/hooks/useEditorUtils';
import { List, ListOrdered } from 'lucide-react';

type EditorListProps = {
  editorRef: React.RefObject<HTMLDivElement | null>;
};

export default function EditorList({ editorRef }: EditorListProps) {
  const { saveSelection, restoreSelection } = useEditorUtils({ editorRef });

  /**
   * 순서가 없는 목록(ul) 적용
   */
  const applyUnorderedList = () => {
    saveSelection();

    if (restoreSelection()) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      console.log('ra', range);

      // 선택된 텍스트를 가져옴
      const selectedText = range.toString().trim();
      if (!selectedText) return;

      // 줄바꿈을 기준으로 라인 분리
      const lines = selectedText.split(/\r?\n/);

      // ul 요소 생성
      const ul = document.createElement('ul');
      ul.style.paddingLeft = '20px'; // 기본 패딩
      ul.style.margin = '8px 0';

      // 각 라인을 li 요소로 추가
      lines.forEach((line) => {
        if (line.trim()) {
          const li = document.createElement('li');
          li.textContent = line.trim();
          ul.appendChild(li);
        }
      });

      // 선택 영역의 내용을 새 목록으로 교체
      range.deleteContents();
      range.insertNode(ul);

      // 커서를 목록 다음으로 이동
      range.setStartAfter(ul);
      range.setEndAfter(ul);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  /**
   * 순서가 있는 목록(ol) 적용
   */
  const applyOrderedList = () => {
    saveSelection();

    if (restoreSelection()) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      // 선택된 텍스트를 가져옴
      const selectedText = range.toString().trim();
      if (!selectedText) return;

      // 줄바꿈을 기준으로 라인 분리
      const lines = selectedText.split(/\r?\n/);

      // ol 요소 생성
      const ol = document.createElement('ol');
      ol.style.paddingLeft = '20px'; // 기본 패딩
      ol.style.margin = '8px 0';

      // 각 라인을 li 요소로 추가
      lines.forEach((line) => {
        if (line.trim()) {
          const li = document.createElement('li');
          li.textContent = line.trim();
          ol.appendChild(li);
        }
      });

      // 선택 영역의 내용을 새 목록으로 교체
      range.deleteContents();
      range.insertNode(ol);

      // 커서를 목록 다음으로 이동
      range.setStartAfter(ol);
      range.setEndAfter(ol);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return (
    <div className="flex h-full  items-center gap-1">
      <Button
        onClick={applyUnorderedList}
        title="순서 없는 목록"
        className="p-1 w-8 h-full border rounded hover:bg-gray-100"
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        onClick={applyOrderedList}
        title="순서 있는 목록"
        className="p-1 w-8 h-full  border rounded hover:bg-gray-100"
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
    </div>
  );
}
