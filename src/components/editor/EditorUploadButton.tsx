import React, { useState, useEffect, useRef } from 'react';
import { EditorButton } from './EditorButton';
import ReactDOM from 'react-dom';
import { useEditorUtils } from '@/hooks/useEditorUtils';
import { getCaretCoordinates } from '@/utiles/editor';
import { useSelectionHighlight } from '@/hooks/useSelectionHighlight';

type PopupType = 'link' | 'image' | null;

type TProps = {
  type: PopupType;
  togglePopup: (type: PopupType) => void;
  children: React.ReactNode;
  renderPopUp: () => React.ReactNode;
  activePopup: PopupType;
  editorRef: React.RefObject<HTMLDivElement | null>;
};

export default function EditorUploadButton({
  type,
  togglePopup,
  children,
  activePopup,
  renderPopUp,
  editorRef,
}: TProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  /**질문 : editorRef를 전역변수를 가지고있는것이 나을려나요? */
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const { saveSelection, restoreSelection } = useEditorUtils({ editorRef });
  const { applySelectionStyle, removeSelectionStyle, highlightSpanRef } =
    useSelectionHighlight(editorRef);

  /**
   * 커서 또는 선택 영역의 위치를 기준으로 팝업 위치 계산
   *  */
  useEffect(() => {
    if (editorRef && activePopup === type && editorRef.current) {
      // 선택 영역 복원 후 위치 계산하기
      restoreSelection();

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rects = range.getClientRects();

        if (rects.length > 0) {
          const lastRect = rects[rects.length - 1];
          setPopupPosition({
            top: lastRect.bottom + window.scrollY + 5,
            left: lastRect.left + window.scrollX,
          });
          return;
        }
      }

      // 선택 영역이 없는 경우
      const caretPosition = getCaretCoordinates(editorRef.current);

      if (caretPosition) {
        setPopupPosition({
          top: caretPosition.y + window.scrollY + 20,
          left: caretPosition.x + window.scrollX,
        });
      } else {
        // 커서 위치를 찾을 수 없는 경우
        alert('링크를 원하는 위치에 커서를 두세요');
      }
    }
  }, [activePopup, type, editorRef, restoreSelection]);

  /**
   * 팝업이 화면 밖으로 나가는 것 방지
   *  */
  useEffect(() => {
    if (activePopup === type && popupRef.current) {
      const popupRect = popupRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // 좌우 화면 경계 체크
      if (popupRect.right > windowWidth) {
        setPopupPosition((prev) => ({
          ...prev,
          left: Math.max(10, windowWidth - popupRect.width - 10),
        }));
      } else if (popupRect.left < 0) {
        setPopupPosition((prev) => ({
          ...prev,
          left: 10,
        }));
      }

      // 하단 화면 경계 체크
      if (popupRect.bottom > windowHeight) {
        setPopupPosition((prev) => ({
          ...prev,
          top: Math.max(10, windowHeight - popupRect.height - 10),
        }));
      }
    }
  }, [activePopup, type, popupPosition]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    saveSelection();
    applySelectionStyle();

    togglePopup(type);
  };

  // 팝업이 닫힐 때 하이라이트 제거
  // useEffect(() => {
  //   if (!activePopup && highlightSpanRef.current) {
  //     // 선택 영역 복원 전에 하이라이트 제거
  //     const timer = setTimeout(() => {
  //       removeSelectionStyle();
  //       restoreSelection(); // 원래 선택 영역 복원
  //     }, 10);
  //     return () => clearTimeout(timer);
  //   }
  // }, [activePopup, restoreSelection]);

  useEffect(() => {
    if (!activePopup && highlightSpanRef.current) {
      requestAnimationFrame(() => {
        // 첫 번째 프레임: 하이라이트 제거
        removeSelectionStyle();

        // 두 번째 프레임: 선택 영역 복원
        requestAnimationFrame(() => {
          restoreSelection();
        });
      });
    }
  }, [activePopup, removeSelectionStyle, restoreSelection]);
  return (
    <div ref={buttonRef} className="relative">
      <EditorButton
        data-popup={type}
        onClick={handleButtonClick}
        className={`h-full w-8 p-2 border rounded ${
          activePopup === type ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
      >
        {children}
      </EditorButton>

      {/* Portal을 사용하여 body에 직접 렌더링 */}
      {activePopup === type &&
        ReactDOM.createPortal(
          <div
            ref={popupRef}
            className="fixed z-50"
            style={{
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
              maxWidth: '90vw',
            }}
          >
            {renderPopUp()}
          </div>,
          document.body,
        )}
    </div>
  );
}
