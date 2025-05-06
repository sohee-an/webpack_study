import React from 'react';
import { EditorButton } from './EditorButton';

type PopupType = 'link' | 'image' | null;
type TProps = {
  type: PopupType;
  togglePopup: (type: PopupType) => void;
  children: React.ReactNode;
  renderPopUp: () => React.ReactNode;
  activePopup: PopupType;
};

export default function EditorUploadButton({
  type,
  togglePopup,
  children,
  activePopup,
  renderPopUp,
}: TProps) {
  return (
    <>
      <EditorButton
        data-popup={type}
        onClick={() => togglePopup(type)}
        className={`relative h-full  w-8 p-2 border rounded ${activePopup === type ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        {children}
        {activePopup === type && renderPopUp()}
      </EditorButton>
    </>
  );
}
