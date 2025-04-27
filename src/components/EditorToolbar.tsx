import React, { useState, useRef, useEffect } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import EditorSelect from './editor/EditorSelect';

import { Italic, Link, Image as ImageIcon } from 'lucide-react';

// Heading 종류 리스트
// const HEADING_LIST = [
//   { label: '본문', value: 'p' },
//   { label: '제목 1', value: 'h1' },
//   { label: '제목 2', value: 'h2' },
//   { label: '제목 3', value: 'h3' },
//   { label: '제목 4', value: 'h4' },
// ] as const;

const COLOR_LIST = [
  { label: '검정', value: '#000000' },
  { label: '빨강', value: '#FF0000' },
  { label: '파랑', value: '#0000FF' },
  { label: '초록', value: '#00FF00' },
] as const;

type ToolbarProps = {
  editorRef: React.RefObject<HTMLDivElement | null>;
};

export default function Toolbar({ editorRef }: ToolbarProps) {
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [fontSizeValue, setFontSizeValue] = useState(16);

  const linkInputRef = useRef<HTMLInputElement>(null);

  // 편집기에 포커스가 변경될 때 선택 영역 저장
  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;

    const handleSelectionChange = () => {
      const selection = window.getSelection();
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
  const saveSelection = () => {
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
  };

  // 저장된 선택 영역을 복원
  const restoreSelection = () => {
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
  };

  // 폰트 사이즈 증가
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

  // 폰트 사이즈 감소
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

  // 직접 폰트 사이즈 적용
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

  // const handleFontSizeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(e.target.value);
  //   if (!isNaN(value) && value > 0) {
  //     setFontSizeValue(value);
  //   }
  // };

  const handleToggleLinkInput = () => {
    saveSelection();
    setShowLinkInput((prev) => !prev);
    setShowImageInput(false);
    setInputValue('');
  };

  /**
   * 하이퍼링크 기능
   */
  const insertLink = () => {
    if (!inputValue) return;

    if (restoreSelection()) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const selectedText = range.toString() || inputValue;

      const anchor = document.createElement('a');
      anchor.href = inputValue;
      anchor.textContent = selectedText;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';

      range.deleteContents();
      range.insertNode(anchor);

      range.setStartAfter(anchor);
      range.setEndAfter(anchor);
      selection.removeAllRanges();
      selection.addRange(range);

      setInputValue('');
      setShowLinkInput(false);
    }
  };

  const wrapSelectionWithElement = (
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
      // ✅ 텍스트를 선택한 경우waaaaaaaaaaaaww
      element.textContent = selectedText;
    } else {
      // ✅ 텍스트 선택이 없고, 커서만 깜빡이는 경우
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

      // 새 선택 영역을 저장
      setSavedRange(newRange.cloneRange());
    } catch (error) {
      console.error('선택 영역 설정 중 오류 발생:', error);
      // 오류가 발생했을 때 fallback으로 원래 선택 위치를 복원
      try {
        const fallbackRange = document.createRange();
        fallbackRange.setStart(originalRange.startContainer, originalRange.startOffset);
        fallbackRange.setEnd(originalRange.endContainer, originalRange.endOffset);
        selection.removeAllRanges();
        selection.addRange(fallbackRange);
        setSavedRange(fallbackRange.cloneRange());
      } catch (fallbackError) {
        console.error('원래 선택 영역 복원 실패:', fallbackError);
      }
    }
  };

  const insertImage = () => {
    if (!inputValue) return;

    if (restoreSelection()) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      const img = document.createElement('img');
      img.src = inputValue;
      img.alt = 'image';
      img.style.maxWidth = '100%';

      range.deleteContents();
      range.insertNode(img);

      // 커서 이동: 이미지 뒤로
      range.setStartAfter(img);
      range.setEndAfter(img);
      selection.removeAllRanges();
      selection.addRange(range);

      setInputValue('');
      setShowImageInput(false);
    }
  };

  const applyBold = () => {
    saveSelection();
    wrapSelectionWithElement('strong');
  };

  const applyItalic = () => {
    saveSelection();
    wrapSelectionWithElement('em');
  };

  const applyColor = (color: string) => {
    saveSelection();
    wrapSelectionWithElement('span', { color });
  };

  return (
    <div className="flex items-center gap-2 mb-4 h-8 py-1">
      {/* Heading Select */}
      <EditorSelect
        onChange={(value) => {
          saveSelection();
          wrapSelectionWithElement(value as keyof HTMLElementTagNameMap);
        }}
      />

      <div className="w-px h-full bg-gray-300"></div>
      {/* Font Size */}
      <button onMouseDown={decreaseFontSize} className="px-2 py-1 border rounded hover:bg-gray-100">
        -
      </button>
      <form onSubmit={(e) => applyFontSize(e)}>
        <input
          onClick={(e) => e.stopPropagation()}
          className="border rounded px-2 py-1 text-sm w-48 bg-white shadow"
          placeholder="이미지 URL 입력"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </form>
      <button onMouseDown={increaseFontSize} className="px-2 py-1 border rounded hover:bg-gray-100">
        +
      </button>

      <div className="w-px h-full bg-gray-300"></div>

      {/* Color */}
      <Select onValueChange={(value) => applyColor(value)}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="color" />
        </SelectTrigger>
        <SelectContent>
          {COLOR_LIST.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="w-px h-full bg-gray-300"></div>
      {/* Bold / Italic */}
      <button onClick={applyBold} className="px-2 py-1 font-bold border rounded hover:bg-gray-100">
        B
      </button>
      <button onClick={applyItalic} className="px-2 py-1 border rounded hover:bg-gray-100">
        <Italic className="w-4 h-4" />
      </button>

      <div className="w-px h-full bg-gray-300"></div>

      {/* 하이퍼링크 */}
      <button
        onClick={handleToggleLinkInput}
        className="relative p-2 border rounded hover:bg-gray-100"
      >
        <Link className="w-4 h-4" />
        {showLinkInput && (
          <div className="absolute top-full mt-1 left-0 flex gap-1">
            <input
              ref={linkInputRef}
              onClick={(e) => e.stopPropagation()}
              className="border rounded px-2 py-1 text-sm w-48 bg-white shadow"
              placeholder="링크를 입력해주세요."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              onClick={insertLink}
              className=" w-14 bg-blue-500 text-white px-2 rounded text-sm hover:bg-blue-600"
            >
              적용
            </button>
          </div>
        )}
      </button>
      <button
        onClick={() => {
          saveSelection();
          setShowImageInput((prev) => !prev);
          setShowLinkInput(false);
          setInputValue('');
        }}
        className="relative p-2 border rounded hover:bg-gray-100"
      >
        <ImageIcon className="w-4 h-4" />
        {showImageInput && (
          <div className="absolute top-full mt-1 left-0 flex gap-1">
            <input
              onClick={(e) => e.stopPropagation()}
              className="border rounded px-2 py-1 text-sm w-48 bg-white shadow"
              placeholder="이미지 URL 입력"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              onClick={insertImage}
              className="w-14 bg-green-500 text-white px-2 rounded text-sm hover:bg-green-600"
            >
              적용
            </button>
          </div>
        )}
      </button>

      <div className="w-px h-full bg-gray-300"></div>
    </div>
  );
}
