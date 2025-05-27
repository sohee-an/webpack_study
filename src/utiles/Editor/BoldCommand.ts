import { Command } from './Commad';

export class BoldCommand implements Command {
  private readonly range: Range; //선택한 텍스트 범위
  private readonly originalContent: string; // 선택된 텍스트의 원본
  private element: HTMLElement; // 태그로 감싼 새 엘리먼트

  constructor(private editorRef: React.RefObject<HTMLDivElement | null>) {
    if (!editorRef.current) throw new Error('Editor가 세팅이 안되어있음');
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) throw new Error('selection이 비어있음');

    this.range = selection.getRangeAt(0).cloneRange();
    this.originalContent = this.range.cloneContents().textContent || '';

    this.element = document.createElement('strong');
    this.element.textContent = this.originalContent;
  }

  execute() {
    const selection = window.getSelection();
    if (!selection) return;

    this.range.deleteContents();
    this.range.insertNode(this.element);

    const newRange = document.createRange();
    newRange.selectNode(this.element);

    // 기존꺼 삭제하고 나서 새로운거 등록
    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  undo() {
    if (this.element.parentNode) {
      const text = document.createTextNode(this.originalContent);
      this.element.parentNode.replaceChild(text, this.element);
    }
  }
}
