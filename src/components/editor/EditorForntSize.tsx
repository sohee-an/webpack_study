import React from 'react';
import { useEditorUtils } from '@/hooks/useEditorUtils';
import EditorButton from './EditorButton';

type EditorFontSizeProps = {
  editorRef: React.RefObject<HTMLDivElement | null>;
  fontSizeValue: number;
  setFontSizeValue: React.Dispatch<React.SetStateAction<number>>;
};

export default function EditorFontSize({
  editorRef,
  fontSizeValue,
  setFontSizeValue,
}: EditorFontSizeProps) {
  const { wrapSelectionWithElement, saveSelection, restoreSelection } = useEditorUtils({
    editorRef,
  });

  /**
   * 폰트 사이즈 증가
   *  */
  const increaseFontSize = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // 선택 영역 복원 시도
    if (!restoreSelection()) {
      // 복원 실패 시 현재 선택 영역 사용
      saveSelection();
    }

    // 상태 업데이트 및 스타일 적용
    setFontSizeValue((prev) => {
      const newSize = Math.min(prev + 1, 72);
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        wrapSelectionWithElement('span', { fontSize: `${newSize}px` });
      }
      return newSize;
    });
  };

  const decreaseFontSize = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // 선택 영역 복원 시도
    if (!restoreSelection()) {
      saveSelection();
    }

    // 상태 업데이트 및 스타일 적용
    setFontSizeValue((prev) => {
      const newSize = Math.max(prev - 1, 8);
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        wrapSelectionWithElement('span', { fontSize: `${newSize}px` });
      }
      return newSize;
    });
  };

  const applyFontSize = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // 선택 영역 복원 시도
      if (!restoreSelection()) {
        saveSelection();
        if (!restoreSelection()) {
          console.log('선택 영역을 복원할 수 없습니다.');
          return;
        }
      }

      wrapSelectionWithElement('span', { fontSize: `${fontSizeValue}px` });
    } catch (error) {
      console.error('폰트 사이즈 적용 중 오류:', error);
    }
  };

  const handleFontSizeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setFontSizeValue(value);
    }
  };

  return (
    <>
      <EditorButton onMouseDown={decreaseFontSize}>-</EditorButton>
      <form onSubmit={applyFontSize}>
        <input
          onMouseDown={(e) => {
            saveSelection();
            e.stopPropagation();
          }}
          onFocus={saveSelection}
          value={fontSizeValue}
          onChange={handleFontSizeInputChange}
          className="w-10 h-full text-center border rounded"
        />
      </form>
      <EditorButton onMouseDown={increaseFontSize}>+</EditorButton>
    </>
  );
}
