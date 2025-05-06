import React from 'react';
import { useSelection } from '@/hooks/useSelection';
import { Button } from '@radix-ui/themes';
import { EditorButton } from './EditorButton';

import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

// 정렬 타입
type TextAlignment = 'left' | 'center' | 'right' | 'justify';

type TProps = {
  editorRef: React.RefObject<HTMLDivElement | null>;
};

export default function EditorTextAlignment({ editorRef }: TProps) {
  // useSelection 훅 사용
  const { saveSelection, restoreSelection } = useSelection({ editorRef });

  const applyAlignment = (alignment: TextAlignment) => {
    saveSelection();

    if (restoreSelection()) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      // 정렬은 주로 블록 요소에 적용되므로, 선택된 텍스트의 부모 요소를 찾음
      let targetNode = range.commonAncestorContainer;

      // 텍스트 노드인 경우 부모 요소로 이동
      if (targetNode.nodeType === Node.TEXT_NODE) {
        const parentNode = targetNode.parentNode;
        // null 체크를 추가하여 타입 안전성 확보
        if (!parentNode) return;
        targetNode = parentNode;
      }

      // 이미지가 선택된 경우
      if ((targetNode as Element).nodeName === 'IMG') {
        // 이미지를 div로 감싸기
        const div = document.createElement('div');
        div.style.textAlign = alignment;

        // 이미지의 부모 노드 참조
        const parent = targetNode.parentNode;
        if (!parent) return; // null 체크 추가

        // 이미지 앞에 div 삽입
        parent.insertBefore(div, targetNode);

        // div에 이미지 이동
        div.appendChild(targetNode);

        // 커서 이동
        range.selectNode(div);
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }

      // 일반 텍스트 선택의 경우
      // 기존 블록 요소 확인 (div, p, h1-h6 등)
      const blockElements = ['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE'];

      if (blockElements.includes((targetNode as Element).nodeName)) {
        // 이미 블록 요소면 스타일 적용
        (targetNode as HTMLElement).style.textAlign = alignment;
      } else {
        // 블록 요소가 아니면 div로 감싸기
        const div = document.createElement('div');
        div.style.textAlign = alignment;

        // 선택된 내용을 복제하여 div에 추가
        const fragment = range.extractContents();
        div.appendChild(fragment);

        // div를 선택 위치에 삽입
        range.insertNode(div);

        // 커서 이동
        range.selectNodeContents(div);
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }
    }
  };
  return (
    <div className="flex items-center  gap-1 h-10">
      <EditorButton
        onClick={() => applyAlignment('left')}
        title="왼쪽 정렬"
        className="p-1 h-8 w-8  flex items-center  justify-center   border rounded hover:bg-gray-100"
      >
        <AlignLeft className="w-4 h-4" />
      </EditorButton>
      <Button
        onClick={() => applyAlignment('center')}
        title="가운데 정렬"
        className="p-1 h-8 w-8 flex items-center  justify-center  border rounded hover:bg-gray-100"
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => applyAlignment('right')}
        title="오른쪽 정렬"
        className="p-1 h-8 w-8 flex items-center  justify-center  border rounded hover:bg-gray-100"
      >
        <AlignRight className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => applyAlignment('justify')}
        title="양쪽 정렬"
        className="p-1 h-8 w-8 flex items-center  justify-center  border rounded hover:bg-gray-100"
      >
        <AlignJustify className="w-4 h-4" />
      </Button>
    </div>
  );
}
