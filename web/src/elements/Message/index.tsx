import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import t from 'i18n';
import { useEffect, useRef, useState } from 'react';
import { userPattern } from 'shared/types/message.helper';

export function TextFormatted({
  text,
  maxChars = null,
  showExpandButton = true,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLongText, setIsLongText] = useState(false);

  const expand = () => {
    setIsExpanded(() => true);
  };

  useEffect(() => {
    if (!maxChars) {
      setIsExpanded(() => true);
      setIsLongText(() => false);
    } else {
      if (text.length > maxChars) {
        setIsLongText(() => true);
      }
    }
  }, [text]);
  return (
    <>
      {!isLongText || isExpanded ? (
        <div>{formatMessage(text)}</div>
      ) : (
        <div>
          {formatMessage(text.slice(0, maxChars))}
          {text.length > maxChars ? '...' : ''}
          {(showExpandButton && isLongText) && (
            <Btn
              btnType={BtnType.corporative}
              caption={t('homeinfo.seeMore')}
              contentAlignment={ContentAlignment.center}
              onClick={() => expand()}
            />
          )}
        </div>
      )}
    </>
  );
}

export function formatMessage(text) {
  const aRef = useRef();
  const content = linkify(text);
  useEffect(() => {
    if (aRef == null) return;
    aRef.current.innerHTML = content;
  }, [aRef, content]);
  return <div ref={aRef} />;
}

function linkify(text) {
  var urlPattern =
    /(?:https?:)?\/\/(?:(?:[\w-]+\.)+[\w/#@~.-]*)(?:\?(?:[\w&=.!,;$#%-]+)?)?/gi;

  text = text.replace(userPattern, function (atUsername) {
    const username = atUsername.substring(1);
    return `<a href="/p/${username}">@${username}</a>`;
  });
  return (text || '').replace(urlPattern, function (url) {
    return '<a href="' + url + '">' + url + '</a>';
  });
}
