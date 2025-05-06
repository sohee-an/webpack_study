import React, { useState, useRef, useEffect } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import EditorFontSize from './editor/EditorForntSize';
import EditorUploadButton from './editor/EditorUploadButton';
import { EditorButton } from './editor/EditorButton';
import EditorSelect from './editor/EditorSelect';
import { useSelection } from '@/hooks/useSelection';
import EditorList from './editor/EditorList';
import { Italic, Link, Image as ImageIcon, Upload, X, AlertCircle } from 'lucide-react';
import { COLOR_LIST } from '@/constants/editor';
import EditorTextAlignment from './editor/EditorTextAlignment';
import { Divider } from './ui/Divider';

type ToolbarProps = {
  editorRef: React.RefObject<HTMLDivElement | null>;
};

// 입력 팝업 타입
type PopupType = 'link' | 'image' | null;

// 이미지 업로드 상태
type ImageUploadStatus = 'idle' | 'loading' | 'error' | 'success';

export default function Toolbar({ editorRef }: ToolbarProps) {
  // const [savedRange, setSavedRange] = useState<Range | null>(null);
  // useSelection 훅 사용
  const { saveSelection, restoreSelection } = useSelection({ editorRef });

  // 팝업 타입 상태 통합
  const [activePopup, setActivePopup] = useState<PopupType>(null);
  const [inputValue, setInputValue] = useState('');
  const [fontSizeValue, setFontSizeValue] = useState(16);

  // 이미지 관련 상태
  const [imageUploadStatus, setImageUploadStatus] = useState<ImageUploadStatus>('idle');
  const [imageErrorMessage, setImageErrorMessage] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // 문서 클릭 시 팝업 닫기
    const handleDocumentClick = (e: MouseEvent) => {
      // 팝업 영역 또는 해당 버튼 클릭이 아닌 경우 팝업 닫기
      if (activePopup && inputRef.current && !inputRef.current.contains(e.target as Node)) {
        const linkButton = document.querySelector('[data-popup="link"]');
        const imageButton = document.querySelector('[data-popup="image"]');

        if (
          !(linkButton && linkButton.contains(e.target as Node)) &&
          !(imageButton && imageButton.contains(e.target as Node))
        ) {
          setActivePopup(null);
          setInputValue('');
          resetImageState();
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [editorRef, activePopup]);

  // 에디터 컨테이너에 이벤트 리스너 추가
  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;

    // 링크 클릭 처리
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link) {
        e.preventDefault();

        // Ctrl/Cmd 키를 누른 상태에서 클릭 시 링크 열기
        if (e.ctrlKey || e.metaKey) {
          const href = link.getAttribute('href');
          if (href !== null) {
            window.open(href, '_blank');
          }
          return;
        }

        // 일반 클릭 시 현재 선택을 링크로 설정
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNode(link);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    };

    // 링크 호버 시 툴팁 표시
    const handleLinkMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link) {
        const existingTooltip = document.querySelector('.link-tooltip');
        if (existingTooltip) {
          existingTooltip.remove();
        }

        // 새 툴팁 생성하기
        const tooltip = document.createElement('div');
        tooltip.className = 'link-tooltip';
        tooltip.textContent = link.getAttribute('href');
        tooltip.style.position = 'absolute';
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px 8px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.zIndex = '1000';

        document.body.appendChild(tooltip);
      }
    };

    // 링크에서 마우스가 벗어날 때 툴팁 제거하기
    const handleLinkMouseOut = () => {
      const tooltip = document.querySelector('.link-tooltip');
      if (tooltip) {
        tooltip.remove();
      }
    };

    editor.addEventListener('click', handleLinkClick);
    editor.addEventListener('mouseover', handleLinkMouseOver);
    editor.addEventListener('mouseout', handleLinkMouseOut);

    return () => {
      editor.removeEventListener('click', handleLinkClick);
      editor.removeEventListener('mouseover', handleLinkMouseOver);
      editor.removeEventListener('mouseout', handleLinkMouseOut);
    };
  }, [editorRef]);

  // 이미지 상태 초기화
  const resetImageState = () => {
    setImageUploadStatus('idle');
    setImageErrorMessage('');
    setImagePreviewUrl('');
    setInputValue('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 팝업 토글 함수 - 하나의 함수로 통합
  const togglePopup = (type: PopupType) => {
    saveSelection();
    console.log('type', type);
    console.log('activePopup', activePopup);

    if (activePopup === type) {
      // 같은 버튼을 다시 누르면 팝업 닫기
      setActivePopup(null);
      setInputValue('');
      resetImageState();
    } else {
      // 다른 팝업으로 변경
      setActivePopup(type);
      setInputValue('');
      resetImageState();

      // 팝업이 열리면 자동으로 input에 포커스
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  // 하이퍼링크 삽입
  const insertLink = () => {
    if (!inputValue) return;

    if (restoreSelection()) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const selectedText = range.toString() || inputValue;

      //선택 영역 내에 링크가 있는지보자
      const parentNode = range.commonAncestorContainer;
      let currentElement;

      // 텍스트 노드인 경우 부모 요소 가져오기
      if (parentNode.nodeType === Node.TEXT_NODE) {
        currentElement = parentNode.parentElement;
      } else {
        currentElement = parentNode;
      }

      // 현재 요소가 어떤 태그인지 확인
      console.log('현재 선택된 요소:', currentElement);

      // URL 검증 및 수정
      let url = inputValue;
      if (!/^https?:\/\//i.test(url)) {
        return alert('URL이 유효하지 않습니다.'); // URL이 유효하지 않으면 경고창 표시
        // url = 'https://' + url;
      }

      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.textContent = selectedText;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';

      range.deleteContents();
      range.insertNode(anchor);

      // 커서를 링크 뒤로 이동
      range.setStartAfter(anchor);
      range.setEndAfter(anchor);
      selection.removeAllRanges();
      selection.addRange(range);

      setInputValue('');
      setActivePopup(null);
    }
  };

  // 이미지 URL 유효성 검사
  const validateImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // 이미지 삽입 전처리
  const prepareImageInsertion = async () => {
    if (!inputValue) return;

    setImageUploadStatus('loading');

    // URL 검증 및 수정
    let url = inputValue;
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    // 이미지 URL 유효성 검사
    const isValid = await validateImageUrl(url);

    if (!isValid) {
      setImageUploadStatus('error');
      setImageErrorMessage('유효하지 않은 이미지 URL입니다.');
      return;
    }

    // 이미지 미리보기 URL 설정
    setImagePreviewUrl(url);
    setImageUploadStatus('success');
  };

  /**
   * 파일 업로드 처리
   * @param e
   * @returns
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 검사
    if (!file.type.startsWith('image/')) {
      setImageUploadStatus('error');
      setImageErrorMessage('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageUploadStatus('error');
      setImageErrorMessage('이미지 크기는 5MB 이하여야 합니다.');
      return;
    }

    setImageUploadStatus('loading');

    // 파일에서 URL 생성 (실제로는 서버에 업로드하고 URL을 받아야 함)
    // 여기서는 임시로 Data URL 사용
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreviewUrl(result);
      setImageUploadStatus('success');
    };
    reader.onerror = () => {
      setImageUploadStatus('error');
      setImageErrorMessage('이미지 로드 중 오류가 발생했습니다.');
    };
    reader.readAsDataURL(file);
  };

  // 이미지 삽입
  const insertImage = () => {
    // 이미지 URL 직접 입력 시 미리보기 생성
    if (inputValue && imageUploadStatus !== 'success') {
      prepareImageInsertion();
      return;
    }

    // 이미지 삽입 실행
    if (imageUploadStatus === 'success' && imagePreviewUrl) {
      if (restoreSelection()) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);

        const img = document.createElement('img');
        img.src = imagePreviewUrl;
        img.alt = 'image';
        img.style.maxWidth = '100%';

        range.deleteContents();
        range.insertNode(img);

        // 커서 이동: 이미지 뒤로
        range.setStartAfter(img);
        range.setEndAfter(img);
        selection.removeAllRanges();
        selection.addRange(range);

        // 상태 초기화
        resetImageState();
        setActivePopup(null);
      }
    }
  };

  // 키보드로 팝업 입력값 제출 처리
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activePopup === 'link') {
        insertLink();
      } else if (activePopup === 'image') {
        insertImage();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setActivePopup(null);
      setInputValue('');
      resetImageState();
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

      // 새 선택 영역을 저장
      // setSavedRange(newRange.cloneRange());
    } catch (error) {
      console.error('선택 영역 설정 중 오류 발생:', error);
      // 오류가 발생했을 때 fallback으로 원래 선택 위치를 복원
      try {
        const fallbackRange = document.createRange();
        fallbackRange.setStart(originalRange.startContainer, originalRange.startOffset);
        fallbackRange.setEnd(originalRange.endContainer, originalRange.endOffset);
        selection.removeAllRanges();
        selection.addRange(fallbackRange);
        // setSavedRange(fallbackRange.cloneRange());
      } catch (fallbackError) {
        console.error('원래 선택 영역 복원 실패:', fallbackError);
      }
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

  // 링크 팝업 UI
  const renderLinkPopup = () => {
    return (
      <div className="absolute top-full mt-1 left-0 flex gap-1 z-10">
        <input
          ref={inputRef}
          onClick={(e) => e.stopPropagation()}
          className="border rounded px-2 py-1 text-sm w-48  bg-white shadow"
          placeholder="링크를 입력해주세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <button
          onClick={insertLink}
          className="w-14 bg-blue-500 hover:bg-blue-600 text-white px-2 rounded text-sm"
        >
          적용
        </button>
      </div>
    );
  };

  // 이미지 팝업 UI
  const renderImagePopup = () => {
    return (
      <div className="absolute top-full mt-1 left-0 z-10 bg-white rounded shadow p-2 w-64">
        {/* 숨겨진 파일 입력 */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
        />

        {/* URL 입력 영역 */}
        <div className="flex gap-1 mb-2">
          <input
            ref={inputRef}
            onClick={(e) => e.stopPropagation()}
            className="border rounded px-2 py-1 text-sm flex-1 bg-white"
            placeholder="이미지 URL 입력"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={imageUploadStatus === 'loading'}
          />
          <button
            onClick={() => inputValue && insertImage()}
            className="bg-green-500 hover:bg-green-600 text-white px-2 rounded text-sm"
            disabled={imageUploadStatus === 'loading'}
          >
            URL
          </button>
        </div>

        {/* 파일 업로드 버튼 */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-1 w-full py-1 mb-2 border rounded text-sm hover:bg-gray-100"
          disabled={imageUploadStatus === 'loading'}
        >
          <Upload className="w-3 h-3" />
          이미지 파일 업로드
        </button>

        {/* 로딩 상태 */}
        {imageUploadStatus === 'loading' && (
          <div className="text-center py-2 text-sm text-gray-600">이미지 로딩 중...</div>
        )}

        {/* 에러 메시지 */}
        {imageUploadStatus === 'error' && (
          <div className="text-center py-1 text-sm text-red-500 flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {imageErrorMessage}
          </div>
        )}

        {/* 이미지 미리보기 */}
        {imageUploadStatus === 'success' && imagePreviewUrl && (
          <div className="relative">
            <div className="relative border rounded overflow-hidden" style={{ maxHeight: '100px' }}>
              <img
                src={imagePreviewUrl}
                alt="Preview"
                className="max-w-full object-contain mx-auto"
                style={{ maxHeight: '100px' }}
              />
            </div>
            <button
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
              onClick={resetImageState}
            >
              <X className="w-3 h-3" />
            </button>
            <button
              className="w-full mt-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
              onClick={insertImage}
            >
              이미지 삽입하기
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2 mb-4 h-[45px] bg-gray-200 p-1 border rounded w-full overflow-x-auto whitespace-nowrap touch-auto  overflow-y-hidden scrollbar-hidden">
      {/* Heading Select */}
      <EditorSelect
        onChange={(value) => {
          saveSelection();
          wrapSelectionWithElement(value as keyof HTMLElementTagNameMap);
        }}
      />

      <Divider />

      {/* Font Size */}
      <EditorFontSize
        editorRef={editorRef}
        fontSizeValue={fontSizeValue}
        setFontSizeValue={setFontSizeValue}
      />

      <Divider />

      {/* Color */}
      <Select onValueChange={(value) => applyColor(value)}>
        <SelectTrigger className="w-[100px] h-full bg-white ">
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

      <Divider />

      {/* Bold / Italic */}
      <EditorButton onClick={applyBold}>B</EditorButton>
      <EditorButton onClick={applyItalic}>
        <Italic className="w-4 h-4" />
      </EditorButton>

      <Divider />

      {/* Text Alignment */}
      <EditorTextAlignment editorRef={editorRef} />

      <Divider />

      <EditorList editorRef={editorRef} />

      <Divider />

      {/* 하이퍼링크 */}
      <EditorUploadButton
        type="link"
        togglePopup={() => togglePopup('link')}
        renderPopUp={renderLinkPopup}
        activePopup={activePopup}
      >
        <Link className="w-4 h-4" />
      </EditorUploadButton>

      {/* 이미지 */}
      <EditorUploadButton
        type="image"
        togglePopup={() => togglePopup('image')}
        renderPopUp={renderImagePopup}
        activePopup={activePopup}
      >
        <ImageIcon className="w-4 h-4" />
      </EditorUploadButton>

      <Divider />
    </div>
  );
}
