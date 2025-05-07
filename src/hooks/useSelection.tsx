import { useState, useEffect, useCallback, RefObject } from 'react';

type UseSelectionProps = {
  editorRef: RefObject<HTMLDivElement | null>;
};

/**
 *  에디터에서 선택된 텍스트의 범위를 저장하고 복원하는 훅
 * @param param0 에디터 DOM 요소에 대한 참조
 * @param param0.editorRef 에디터 DOM 요소에 대한 참조
 * @returns
 */
export function useSelection({ editorRef }: UseSelectionProps) {
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  // 선택 영역 변경 감지를 위한 이벤트 리스너 등록
  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      console.log('sele', selection);

      // 현재 선택된 영역확인
      if (selection && selection.rangeCount > 0 && editor.contains(selection.anchorNode)) {
        saveSelection();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [editorRef]);

  // 현재 선택 영역을 저장
  const saveSelection = useCallback(() => {
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        setSavedRange(range.cloneRange());
        return true;
      }
    } catch (e) {
      console.error('선택 영역 저장 중 오류:', e);
    }
    return false;
  }, []);

  // 저장된 선택 영역을 복원
  const restoreSelection = useCallback(() => {
    try {
      if (savedRange) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(savedRange.cloneRange());
          return true;
        }
      }
    } catch (e) {
      console.error('선택 영역 복원 중 오류:', e);
    }
    return false;
  }, [savedRange]);

  return {
    savedRange,
    saveSelection,
    restoreSelection,
  };
}
