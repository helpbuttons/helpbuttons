///Accordion section component for displaying long section data
import React, { Component } from 'react';


export default function Accordion({
    title,
    children,
}: BtnProps) {

    return (
        <>
          <button id={title} className="accordion">{title}</button>
            <div className="panel">
              {children}
            </div>
        </>

    );
}
