import { FilterByNumber } from "components/search/AdvancedFilters/filter-by-number";
import { useEffect, useState } from "react";
import { getShareLink } from "shared/sys.helper";
import { encode } from "html-entities";
import { defaultDaysForEmbbed } from "components/search/AdvancedFilters/filters.type";
import t from "i18n";

export function ShareEmbbedForm() {


    const getIframe = (days) => {
      return `<iframe src="${getShareLink(
        '/Embbed/' + days,
      )}" width="100%" height="100%"></iframe>`;
    };
  
    const [nrButtons, setNrButtons] = useState(defaultDaysForEmbbed);
    const [iframeCode, setIframeCode] = useState(getIframe(nrButtons));
    useEffect(() => {
      setIframeCode(() => getIframe(nrButtons));
    }, [nrButtons]);
    return (
      <div className="form__field">
        <div className="form__label">Embbed</div>
        <div className="form__explain">{t('share.shareExplain')}</div>
  
        <FilterByNumber
          number={nrButtons}
          setNumber={setNrButtons}
          label={nrButtons}
        />
  
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
  