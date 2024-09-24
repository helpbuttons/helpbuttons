import { useEffect, useState } from "react";
import { getShareLink } from "shared/sys.helper";
import { encode } from "html-entities";
import t from "i18n";

export function ShareEmbbedForm() {


    const getIframe = () => {
      return `<iframe src="${getShareLink(
        '/Embbed'
      )}" width="100%" height="100%"></iframe>`;
    };
  
    // const [nrButtons, setNrButtons] = useState(defaultDaysForEmbbed);
    const [iframeCode, setIframeCode] = useState(getIframe());
    useEffect(() => {
      setIframeCode(() => getIframe());
    }, []);
    return (
      <div className="form__field">
        <div className="form__label">Embbed</div>
        <div className="form__explain">{t('share.shareExplain')}</div>
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
  