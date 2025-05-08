import { useRef, useCallback } from 'react';
import { useEditorUtils } from './useEditorUtils';

export const useSelectionHighlight = (editorRef: React.RefObject<HTMLDivElement | null>) => {
  const highlightSpanRef = useRef<HTMLSpanElement | null>(null);
  const { restoreSelection } = useEditorUtils({ editorRef });

  // 선택 영역에 스타일 적용
  const applySelectionStyle = useCallback(() => {
    removeSelectionStyle();

    // 저장된 선택 영역 복원
    if (restoreSelection()) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (range.toString().trim() === '') return null;

        const span = document.createElement('span');
        span.className = 'text-selection-highlight';
        span.style.backgroundColor = '#d0d0d3';

        try {
          range.surroundContents(span);
          highlightSpanRef.current = span;

          /**질문 : 이 부분은 어차피 인풋에 포커스가 가기때문에 사라질텐데
           * 굳이 여기서 없애는코드를넣을 필요가 있는건가?
           * 안정성 때문인가? 과연 이게 안정성이 되는건가?
           * 그치만 넣는다면 맥락적으로는 넣는게 더 자연스럽기는 함*/
          // selection.removeAllRanges();
          return span;
        } catch (e) {
          console.error('선택 영역을 감싸는 중 오류 발생:', e);
        }
      }
    }
    return null;
  }, []);

  // 선택 영역 스타일 제거
  const removeSelectionStyle = useCallback(() => {
    if (highlightSpanRef.current && highlightSpanRef.current.parentNode) {
      const textContent = highlightSpanRef.current.textContent || '';
      const textNode = document.createTextNode(textContent);
      highlightSpanRef.current.parentNode.replaceChild(textNode, highlightSpanRef.current);
      highlightSpanRef.current = null;
    }
  }, []);

  return {
    applySelectionStyle,
    removeSelectionStyle,
    highlightSpanRef,
  };
};
