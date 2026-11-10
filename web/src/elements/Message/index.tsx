import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import t from 'i18n';
import { useEffect, useRef, useState } from 'react';
import { userPattern } from 'shared/types/message.helper';
import { ButtonService } from 'services/Buttons';
import { store } from 'state';
import { FindAndSetMainPopupCurrentButton } from 'state/HomeInfo';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';

const BUTTON_ID_PATTERN = /\/(?:ButtonFile|Show)\/([\w-]+)/g;

function extractButtonIds(text: string): string[] {
  const ids: string[] = [];
  const pattern = new RegExp(BUTTON_ID_PATTERN.source, 'g');
  let match;
  while ((match = pattern.exec(text)) !== null) {
    ids.push(match[1]);
  }
  return Array.from(new Set(ids));
}

function ButtonLinkPreview({ buttonId }) {
  const [button, setButton] = useState(null);

  useEffect(() => {
    const sub = ButtonService.findById(buttonId).subscribe({
      next: (b) => setButton(b),
      error: () => {},
    });
    return () => sub.unsubscribe();
  }, [buttonId]);

  if (!button) return null;

  return (
    <div
      className="message__button-preview"
      onClick={() => store.emit(new FindAndSetMainPopupCurrentButton(buttonId))}
    >
      {button.image && (
        <ImageWrapper
          imageType={ImageType.preview}
          src={button.image}
          alt={button.title}
        />
      )}
      <div className="message__button-preview__title">{button.title}</div>
    </div>
  );
}

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
        <FormatMessage text={text} />
      ) : (
        <div>
          <FormatMessage text={text.slice(0, maxChars)} />
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

export function FormatMessage({ text }) {
  const aRef = useRef<HTMLSpanElement>(null);
  const content = linkify(text);
  const buttonIds = extractButtonIds(text || '');

  useEffect(() => {
    if (aRef.current) {
      aRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <>
      <span ref={aRef} />
      {buttonIds.map((id) => (
        <ButtonLinkPreview key={id} buttonId={id} />
      ))}
    </>
  );
}

function linkify(text) {
  const urlPattern =
    /(?:https?:\/\/|www\.)(?:(?:[\w-]+\.)+[\w/#@~.-]*)(?:\?(?:[\w&=.!,;$#%-]+)?)?/gi;

  text = (text || '').replace(/\n/g, '<br>');
  text = text.replace(userPattern, function (atUsername) {
    const username = atUsername.substring(1);
    return `<a href="/p/${username}">@${username}</a>`;
  });
  return text.replace(urlPattern, function (url) {
    const href = url.startsWith('www.') ? 'https://' + url : url;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}
