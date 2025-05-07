import React, { useState, useEffect, useRef } from 'react';
import { EditorButton } from './EditorButton';
import ReactDOM from 'react-dom';
import { useEditorUtils } from '@/hooks/useEditorUtils';
import { getCaretCoordinates } from '@/utiles/editor';

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
  const highlightSpanRef = useRef<HTMLSpanElement | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const { saveSelection, restoreSelection } = useEditorUtils({ editorRef });

  // const handleButtonClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation(); // 이벤트 전파 중지 - 중요!

  //   saveSelection(); // 선택 영역 저장
  //   togglePopup(type); // 팝업 토글
  // };
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

  /**
   * 선택 영역에 스타일 적용
   */
  const applySelectionStyle = () => {
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
  };

  /**
   * 선택 영역 스타일 제거
   *  */
  const removeSelectionStyle = () => {
    if (highlightSpanRef.current && highlightSpanRef.current.parentNode) {
      const textContent = highlightSpanRef.current.textContent || '';
      const textNode = document.createTextNode(textContent);
      highlightSpanRef.current.parentNode.replaceChild(textNode, highlightSpanRef.current);
      highlightSpanRef.current = null;
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    saveSelection();
    applySelectionStyle();

    // 팝업 토글
    togglePopup(type);
  };

  // 팝업이 닫힐 때 하이라이트 제거
  useEffect(() => {
    if (!activePopup && highlightSpanRef.current) {
      // 선택 영역 복원 전에 하이라이트 제거
      const timer = setTimeout(() => {
        removeSelectionStyle();
        restoreSelection(); // 원래 선택 영역 복원
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [activePopup, restoreSelection]);

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
