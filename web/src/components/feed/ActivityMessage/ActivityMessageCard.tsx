import Loading from 'components/loading';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { TextFormatted, formatMessage } from 'elements/Message';
import t from 'i18n';
import Link from 'next/link';
import router from 'next/router';
import { store } from 'pages';
import { ErrorLink } from 'pages/Error';
import { useEffect, useRef, useState } from 'react';
import { alertService } from 'services/Alert';
import {
  buttonColorStyle,
  showButtonTypeCaption,
  useButtonTypes,
} from 'shared/buttonTypes';
import { readableTimeLeftToDate } from 'shared/date.utils';
import { ActivityMessageDto } from 'shared/dtos/activity.dto';
import { ButtonTemplate } from 'shared/dtos/button.dto';
import { PrivacyType } from 'shared/types/privacy.enum';
import { ActivityMarkAsRead } from 'state/Activity';
import { FindButton, updateCurrentButton } from 'state/Explore';

export function ActivityMessageCard({
  message,
}: {
  message: ActivityMessageDto;
}) {
  const buttonTypes = useButtonTypes();
  const [buttonType, setButtonType] = useState<ButtonTemplate>(null);
  const button = message?.button ? message.button : null;
  useEffect(() => {
    if (buttonTypes && button?.type) {
      setButtonType(() =>
        buttonTypes.find(
          (buttonTemplate) => buttonTemplate.name == button.type,
        ),
      );
    } 
  }, [buttonTypes, button]);
  const [markingAsRead, setMarkingAsRead] = useState(false);

  const jumpToButtonMessage = (messageId, read) => {
    if (!read) {
      setMarkingAsRead(() => true);
      store.emit(
        new ActivityMarkAsRead(messageId, () => {
          setMarkingAsRead(() => false);
          alertService.info(t('notificaction.markedAsRead'));
          const buttonId = message.button.id;
          store.emit(
            new FindButton(buttonId, (button) => {
              store.emit(new updateCurrentButton(button));
            }),
          );
          // router.push('/ButtonFile/' + message?.button.id.toString())
        }),
      );
    } else {
      const buttonId = message.button.id;
      store.emit(
        new FindButton(buttonId, (button) => {
          store.emit(new updateCurrentButton(button));
        }),
      );
    }
  };

  return (
    <>
      {/* {markingAsRead && <Loading />} */}

      {message?.button && (
        <Link
          href="#"
          onClick={() =>
            jumpToButtonMessage(message.id, message.read)
          }
          className="card-notification card-notification--ribbon"
          // style={buttonColorStyle(buttonType?.cssColor)}
        >
          <div
            className="card-notification__comment-count"
            // style={buttonColorStyle(buttonType?.cssColor)}
          >
            <div className="card-notification__label">
              <div className="card-notification__helpbutton-type"
                style={{ color: buttonType?.cssColor }}
              >
                {buttonType?.icon}
                <span>
                  {showButtonTypeCaption(message.button.type)}
                </span>
              </div>
              <p className="card-notification__helpbutton-title">{message.button.title}</p>
            </div>
          </div>
          <div className="card-notification__content">
            <div className="card-notification__avatar">
              <div className="avatar-medium">
                <ImageWrapper
                  imageType={ImageType.avatarMed}
                  src={message.image}
                  alt="image"
                />
                {message.button.image && (
                  <ImageWrapper
                    imageType={ImageType.avatarMed}
                    src={message.button.image}
                    alt="image"
                  />
                )}
              </div>
            </div>
            <div className="card-notification__text">
              <div className="card-notification__header">
                <div className="card-notification__info">
                  {message.authorName} {t('feed.said')}: 
                  &nbsp;
                  {message.privacy == PrivacyType.PRIVATE && (
                    <span style={{ color: 'red' }}>
                      {t('feed.privateBadge')}
                    </span>
                  )}
                  {/* <h2 className="card-notification__name">{title}</h2>  */}
                </div>
                <div className="card-notification__type">
                  <div className="card-notification__date">
                    {readableTimeLeftToDate(message.createdAt)}
                  </div>
                </div>
              </div>
              <div className="card-notification__paragraph">
                <TextFormatted
                  text={message.message}
                  maxChars={100}
                />
                {/* {message && formatMessage(m)} */}
              </div>
            </div>
          </div>
        </Link>
      )}
      {!message?.button && (
        <ErrorLink
          errorMessage={`Error message has an error, please contact the administrator of your network with this message, including this ${message.id} which identifies your message. Thank you`}
        />
      )}
    </>
  );
}
