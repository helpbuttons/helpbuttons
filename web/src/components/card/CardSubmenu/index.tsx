import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import t from 'i18n';
import { useState } from 'react';
import { IoEllipsisHorizontalSharp, IoMail, IoMailOpenOutline, IoSendOutline } from 'react-icons/io5';

export function CardSubmenu({ children }) {
  const [showSubmenu, setShowSubmenu] = useState(false);  
  return (
    <div>
      <div

        className="card-button__edit-icon card-button__submenu"
      >
         <Btn
          btnType={BtnType.filterCorp}
          contentAlignment={ContentAlignment.left}
          iconRight={IconType.circle}
          caption={t('button.send')}
          iconLink={<IoMailOpenOutline />}
          
        />
        <Btn
          btnType={BtnType.filterCorp}
          contentAlignment={ContentAlignment.center}
          iconRight={IconType.circle}
          iconLink={<IoEllipsisHorizontalSharp />}
          onClick={() => {
            setShowSubmenu(!showSubmenu);
          }}
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
    </div>
  );
}

export function CardSubmenuOption({ label, onClick }) {
  return (
    <a className="card-button__trigger-options" onClick={onClick}>
      {label}
    </a>
  );
}
