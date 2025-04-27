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

      const selectedText = range.toString().trim();

      if (selectedText) {
        // 선택된 텍스트가 있는 경우, 기존 로직 수행
        // 줄바꿈을 기준으로 라인 분리
        const lines = selectedText.split(/\r?\n/);

        const ul = document.createElement('ul');
        ul.style.paddingLeft = '20px';
        ul.style.margin = '8px 0';

        lines.forEach((line) => {
          if (line.trim()) {
            const li = document.createElement('li');
            li.textContent = line.trim();
            ul.appendChild(li);
          }
        });

        range.deleteContents();
        range.insertNode(ul);

        // 커서를 li 안에 위치시킴
        const lastLi = ul.lastChild;
        if (lastLi) {
          range.selectNodeContents(lastLi);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else {
        // 선택된 텍스트가 없는 경우, 커서 위치에 빈 목록 생성
        const ul = document.createElement('ul');
        ul.style.paddingLeft = '20px';
        ul.style.margin = '8px 0';
        ul.style.listStyleType = 'disc';

        // 빈 li 요소 생성
        const li = document.createElement('li');
        li.innerHTML = '&#8203;'; // 영 너비 공백(Zero-width space)
        ul.appendChild(li);
        li.style.display = 'list-item';

        range.deleteContents();
        range.insertNode(ul);

        range.selectNodeContents(li);
        selection.removeAllRanges();
        selection.addRange(range);
      }
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

      // 선택된 텍스트 확인
      const selectedText = range.toString().trim();

      if (selectedText) {
        // 선택된 텍스트가 있는 경우
        // 줄바꿈을 기준으로 라인 분리
        const lines = selectedText.split(/\r?\n/);

        // ol 요소 생성
        const ol = document.createElement('ol');
        ol.style.paddingLeft = '20px';
        ol.style.margin = '8px 0';
        ol.style.listStyleType = 'decimal'; // 명시적으로 숫자 스타일 지정

        // 각 라인을 li 요소로 추가
        lines.forEach((line) => {
          if (line.trim()) {
            const li = document.createElement('li');
            li.textContent = line.trim();
            li.style.display = 'list-item'; // 명시적으로 목록 항목으로 표시
            ol.appendChild(li);
          }
        });

        // 선택 영역의 내용을 새 목록으로 교체
        range.deleteContents();
        range.insertNode(ol);

        // 커서를 마지막 li 안에 위치시킴
        const lastLi = ol.lastChild;
        if (lastLi) {
          range.selectNodeContents(lastLi);
          range.collapse(false); // 끝 부분으로 커서 이동
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else {
        // 선택된 텍스트가 없는 경우, 커서 위치에 빈 목록 생성
        const ol = document.createElement('ol');
        ol.style.paddingLeft = '20px';
        ol.style.margin = '8px 0';
        ol.style.listStyleType = 'decimal'; // 명시적으로 숫자 스타일 지정

        // 빈 li 요소 생성
        const li = document.createElement('li');
        li.innerHTML = '&#8203;'; // 영 너비 공백(Zero-width space)
        li.style.display = 'list-item'; // 명시적으로 목록 항목으로 표시
        ol.appendChild(li);

        // 커서 위치에 목록 삽입
        range.deleteContents();
        range.insertNode(ol);

        // 커서를 li 안에 위치시킴
        range.selectNodeContents(li);
        selection.removeAllRanges();
        selection.addRange(range);
      }
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
