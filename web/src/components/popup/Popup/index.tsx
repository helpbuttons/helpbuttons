///popup general component for all overlayed sections like PopupExtraFilters
//Form component with the main fields for signup in the platform
//imported from libraries
import PopupHeader from 'components/popup/PopupHeader';


export default function Popup({children, sectionClass = "popup__section", title = '', linkFwd = null,linkBack= null, onScroll = null, ...props}) {

  return (
          <div className="popup">
              <PopupHeader linkFwd={linkFwd} linkBack={linkBack}>{title}</PopupHeader>
              <div className="popup__content" onScroll={onScroll}>
                <div className={sectionClass}>
                    {children}
                </div>
              </div>
          </div>
  );

}
