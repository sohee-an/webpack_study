/**contetntEditable 안에 있는 커서 위치를 찾는 함수 */
export const getCaretCoordinates = (element: HTMLElement) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);

  if (!element.contains(range.startContainer.parentElement)) return null;

  /**빈 요소를 생성해서 커서 위치에 만들기 */
  const span = document.createElement('span');
  span.innerHTML = '&#8203;';

  const clonedRange = range.cloneRange();

  clonedRange.collapse(false); // 커서 끝 위치로 이동하기
  clonedRange.insertNode(span);

  // span의 위치를 측정하기
  const rect = span.getBoundingClientRect();

  if (span.parentNode) {
    span.parentNode.removeChild(span);
  }

  return {
    x: rect.left,
    y: rect.top,
  };
};
