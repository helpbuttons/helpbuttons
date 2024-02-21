import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import { useState } from 'react';
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';

export function CardSubmenu({ children }) {
  const [showSubmenu, setShowSubmenu] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setShowSubmenu(!showSubmenu);
        }}
        className="card-button__edit-icon card-button__submenu"
      >
        <Btn
          btnType={BtnType.smallCircle}
          contentAlignment={ContentAlignment.center}
          iconRight={IconType.circle}
          iconLink={<IoEllipsisHorizontalSharp />}
          submit={true}
        />
      </div>
      {showSubmenu && (
        <div className="card-button__dropdown-container">
          <div className="card-button__dropdown-arrow"></div>
            <div className="card-button__dropdown-content" id="listid">
              {children}
            </div>
        </div>
      )}
    </>
  );
}

export function CardSubmenuOption({ label, onClick }) {
  return (
    <a className="card-button__trigger-options" onClick={onClick}>
      {label}
    </a>
  );
}
