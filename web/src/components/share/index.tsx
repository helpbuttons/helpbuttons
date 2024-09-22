import PickerField from "components/picker/PickerField";
import { FilterByNumber } from "components/search/AdvancedFilters/filter-by-number";
import { defaultDaysForEmbbed } from "components/search/AdvancedFilters/filters.type";
import Btn from "elements/Btn";
import { DropdownField } from "elements/Dropdown/Dropdown";
import { encode } from "html-entities";
import t from "i18n";
import { useEffect, useState } from "react";
import { useShowPopup } from "shared/custom.hooks";
import { getShareLink } from "shared/sys.helper";

export function SharePopup({}) {
    enum shareOptions {
      rss = 'rss',
      ics = 'ics',
      iframe = 'iframe',
      ap = 'ap',
    }
    const [popupShowState, openPopup, closePopup] = useShowPopup();
    const [shareOptionSelected, setShareOptionSelected] =
      useState<shareOptions>(shareOptions.iframe);
  
      const getIframe = (days) => {
        return `<iframe src="${getShareLink("/Embbed/" + days)}" width="100%" height="100%"></iframe>`
      }
  
    const [nrButtons, setNrButtons] = useState(defaultDaysForEmbbed);
    const [iframeCode, setIframeCode] = useState(getIframe(nrButtons))
    useEffect(() => {
        setIframeCode(() => getIframe(nrButtons))
    }, [nrButtons])
    
    return (
      <>
        <div>
          <PickerField
            btnLabel={t('share.showSharePopup')}
            label={t('share.showSharePopup')}
            headerText={t('share.showSharePopup')}
            showPopup={popupShowState}
            openPopup={openPopup}
            closePopup={closePopup}
          >
            <div className="form__field">
              <div className="form__label">{t('share.shareTypeLabel')}</div>
              <div className="form__explain">{t('share.shareTypeExplain')}</div>
              <DropdownField
                options={[
                  {
                    value: shareOptions.rss,
                    name: 'Rss feed',
                  },
                  {
                    value: shareOptions.ics,
                    name: 'ICS/ICAL',
                  },
                  {
                    value: shareOptions.iframe,
                    name: 'embbedable',
                  },
                  {
                    value: shareOptions.ap,
                    name: 'Fediverse',
                  },
                ]}
                
                onChange={(value) => setShareOptionSelected(() => value)}
                value={shareOptionSelected}
              />
            </div>

            <div className="form__field">
              <div className="form__label">{shareOptionSelected}</div>
              <div className="form__explain">{t('share.shareExplain')}</div>
        
              <FilterByNumber number={nrButtons} setNumber={setNrButtons} label={nrButtons} />

              <div className='_iframe__code'>
                <div className="__iframe__code-box">
                  <pre>
                    <code dangerouslySetInnerHTML={{__html: encode(iframeCode)}}>
                    </code>
                  </pre>
                </div>
                <code dangerouslySetInnerHTML={{__html: iframeCode}}/>
              </div>
            </div>
          </PickerField>
        </div>
      </>
    );
  }
