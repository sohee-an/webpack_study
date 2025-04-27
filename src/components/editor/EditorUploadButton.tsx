import React from 'react';
import { Button } from '../ui/button';

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
  console.log('type', type);
  return (
    <Button
      data-popup={type}
      onClick={() => togglePopup(type)}
      className={`relative p-2 border rounded ${activePopup === type ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
    >
      {children}
      {activePopup === type && renderPopUp()}
    </Button>
  );
}
