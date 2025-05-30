import { useCallback } from 'react';
import { useSelection } from '@/hooks/useSelection';

type UseEditorUtilsProps = {
  editorRef: React.RefObject<HTMLDivElement | null>;
};

/**
 * 에디터에서 선택된 텍스트를 HTML 요소로 감싸는 유틸리티 훅
 * @param editorRef 에디터 DOM 요소에 대한 참조
 * @returns {Object} 에디터 유틸리티 함수들
 */
export function useEditorUtils({ editorRef }: UseEditorUtilsProps) {
  // useSelection 훅 사용
  const { saveSelection, restoreSelection } = useSelection({ editorRef });

  /**
   * 선택된 텍스트를 HTML 요소로 감싸는 함수
   */
  const wrapSelectionWithElement = useCallback(
    (
      tag: keyof HTMLElementTagNameMap,
      style?: Partial<CSSStyleDeclaration>,
      e?: React.FormEvent<HTMLFormElement>,
    ) => {
      if (e) {
        e.preventDefault();
      }

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (!selectedText) return;

      // 선택한 범위를 임시로 저장
      const originalRange = {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset,
      };

      const element = document.createElement(tag);
      if (selectedText) {
        element.textContent = selectedText;
      } else {
        element.innerHTML = '&#8203;'; // (Zero-width space) 넣어줘야 깨지지 않음
      }

      // 스타일 추가
      if (style) {
        Object.assign(element.style, style);
      }

      // 기존 선택 영역 삭제하고 새 노드 삽입
      range.deleteContents();
      range.insertNode(element);

      // 삽입된 요소 선택을 유지하기 위해 새 범위를 생성
      const newRange = document.createRange();

      try {
        // 텍스트 노드인 경우 (일반적인 경우)
        if (element.firstChild && element.firstChild.nodeType === Node.TEXT_NODE) {
          newRange.selectNodeContents(element);
        } else {
          // 텍스트 노드가 아닌 경우 (span 등)
          newRange.selectNode(element);
        }

        // 새로운 선택 영역 설정
        selection.removeAllRanges();
        selection.addRange(newRange);
      } catch (error) {
        console.error('선택 영역 설정 중 오류 발생:', error);
        // 오류가 발생했을 때 fallback으로 원래 선택 위치를 복원
        try {
          const fallbackRange = document.createRange();
          fallbackRange.setStart(originalRange.startContainer, originalRange.startOffset);
          fallbackRange.setEnd(originalRange.endContainer, originalRange.endOffset);
          selection.removeAllRanges();
          selection.addRange(fallbackRange);
        } catch (fallbackError) {
          console.error('원래 선택 영역 복원 실패:', fallbackError);
        }
      }
    },
    [saveSelection],
  );

  /**
   * 선택 영역이 존재하는지 확인하고, 없으면 복원 시도
   */
  const ensureSelection = useCallback(() => {
    if (!restoreSelection()) {
      saveSelection();
      return restoreSelection();
    }
    return true;
  }, [saveSelection, restoreSelection]);

  return {
    saveSelection,
    restoreSelection,
    wrapSelectionWithElement,
    ensureSelection,
  };
}
