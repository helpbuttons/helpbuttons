import { useEffect, useState } from "react";
import { getShareLink } from "shared/sys.helper";
import { encode } from "html-entities";
import t from "i18n";
import { FilterByNumber } from "components/search/AdvancedFilters/filter-by-number";
import { defaultButtonsForEmbbed } from "components/search/AdvancedFilters/filters.type";

export const getIframe = (nrButtons) => {
  return `<iframe src="${getShareLink(
    '/Embbed/'+nrButtons
  )}" width="100%" height="100%"></iframe>`;
};

export function ShareEmbbedForm() {
  
    const [nrButtons, setNrButtons] = useState(defaultButtonsForEmbbed);
    const [iframeCode, setIframeCode] = useState(getIframe(nrButtons));
    useEffect(() => {
      setIframeCode(() => getIframe(nrButtons));
    }, [nrButtons]);
    return (
      <div className="form__field">
        <div className="form__label">Embbed</div>
        <div className="form__explain">{t('share.shareExplain')}</div>
        <FilterByNumber number={nrButtons} setNumber={setNrButtons} label={nrButtons} max={15}/>
        <div className="_iframe__code">
          <div className="__iframe__code-box">
            <pre>
              <code
                dangerouslySetInnerHTML={{ __html: encode(iframeCode) }}
              ></code>
            </pre>
          </div>
          <code dangerouslySetInnerHTML={{ __html: iframeCode }} />
        </div>
      </div>
    );
  }
  