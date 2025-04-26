import React, { ReactNode } from 'react';
type LayoutProps = {
  children: ReactNode;
};

const DUMMY_DATA = {
  title: '이력서',
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full h-full p-4">
      <section className="w-full pb-2 ">
        <div>{DUMMY_DATA.title}</div>
      </section>
      {children}
    </div>
  );
}
