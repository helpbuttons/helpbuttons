import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';
import useComponentVisible from 'shared/custom.hooks';


export function CardSubmenu({ children }) {
  const { ref, showSubmenu, setShowSubmenu } = useComponentVisible(false);
  return (
    <div ref={ref}>
      <div

        className="card-button__edit-icon card-button__submenu"
      >
         {/* <Btn
          btnType={BtnType.filterCorp}
          contentAlignment={ContentAlignment.left}
          iconRight={IconType.circle}
          iconLink={<IoMailOpenOutline />}
          
        />
        <Btn
          btnType={BtnType.filterCorp}
          contentAlignment={ContentAlignment.left}
          iconRight={IconType.circle}
          iconLink={<IoCallOutline />}
          
        /> */}
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
