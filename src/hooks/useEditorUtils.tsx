import { useCallback } from 'react';
import { useSelection } from './useSelection';

type TProps = {
  editorRef: React.RefObject<HTMLDivElement | null>;
};

export function useEditorUtils({ editorRef }: TProps) {
  // useSelection 훅 사용
  const { saveSelection, restoreSelection } = useSelection({ editorRef });

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
    },
    [saveSelection], // 의존성 배열에 필요한 함수 추가
  );

  // 폰트 사이즈 등 다른 스타일 적용 함수들도 여기에 추가...

  return {
    saveSelection,
    restoreSelection,
    wrapSelectionWithElement,
  };
}
