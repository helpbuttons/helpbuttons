///popup general component for all overlayed sections like PopupExtraFilters
//Form component with the main fields for signup in the platform
//imported from libraries
import PopupHeader from 'components/popup/PopupHeader';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import t from 'i18n';

export default function Popup({
  children,
  cancelAction = null,
  approveAction = null,
  sectionClass = 'popup__section',
  title = '',
  linkFwd = null,
  linkBack = null,
  onScroll = null,
  ...props
}) {
  return (
    <div className="popup">
      <PopupHeader linkFwd={linkFwd} linkBack={linkBack}>
        {title}
      </PopupHeader>
      <div className="popup__content" onScroll={onScroll}>
        <div className={sectionClass}>{children}</div>
      </div>
        <div className="popup__actions">
          <div className={'popup__options-h'}>
            {cancelAction && (
              <Btn
                btnType={BtnType.splitIcon}
                caption={t('common.reset')}
                contentAlignment={ContentAlignment.center}
                onClick={(e) => cancelAction(e)}
              />
            )}
            {approveAction && (
              <Btn
                submit={true}
                btnType={BtnType.submit}
                caption={t('common.search')}
                contentAlignment={ContentAlignment.center}
                onClick={() => approveAction()}
              />
            )}
          </div>
        </div>
      
    </div>
  );
}
