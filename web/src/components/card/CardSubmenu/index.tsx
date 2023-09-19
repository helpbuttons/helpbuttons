import { useState } from 'react';
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';

export function CardSubmenu({ children }) {
  const [showSubmenu, setShowSubmenu] = useState(false);

  return (
    <section>
      <div
        onClick={() => {
          setShowSubmenu(!showSubmenu);
        }}
        className="card-button__edit-icon card-button__submenu"
      >
        <IoEllipsisHorizontalSharp />
      </div>
      {showSubmenu && (
        <div className="card-button__dropdown-container">
          <div className="card-button__dropdown-arrow"></div>

          <div className="card-button__dropdown-content" id="listid">
            {children}
          </div>
        </div>
      )}
    </section>
  );
}

export function CardSubmenuOption({ label, onClick }) {
  return (
    <a className="card-button__trigger-options" onClick={onClick}>
      {label}
    </a>
  );
}
