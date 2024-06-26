///popup general component for all overlayed sections like PopupExtraFilters
//Form component with the main fields for signup in the platform
//imported from libraries
import PopupHeader from 'components/popup/PopupHeader';


export default function PopupButtonFile({children, title = '', linkBack = null, linkFwd = null, ...props}) {

  return (
          <div className="popup--button-file">
              <PopupHeader linkFwd={linkFwd} linkBack={linkBack}>{title}</PopupHeader>
              <div className="popup__content">
                    {children}
              </div>
          </div>
  );

}
