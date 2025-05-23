//Main card of the Button that is used inside ButtonFile component and in ButtonNewPublish for the preview. It has all the Data that a button has andd displays it according to the main buttonTemplate and network that buttton selected.
import {
  IoHeartOutline,
  IoAddCircleOutline,
  IoEllipsisHorizontalSharp,
  IoMailOutline,
  IoCallOutline,
  IoHeart,
  IoLogoWhatsapp,
  IoLocationOutline,
} from 'react-icons/io5';
import t from 'i18n';

import ImageWrapper, { ImageType } from 'elements/ImageWrapper';

import router from 'next/router';
import { useEffect, useState } from 'react';
import {
  getShareLink,
  makeImageUrl,
  readableDistance,
} from 'shared/sys.helper';
import {
  buttonColorStyle,
  isEventAndIsExpired,
  useButtonType,
} from 'shared/buttonTypes';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { useRef } from 'store/Store';
import { GlobalState, store, useGlobalStore } from 'state';
import Link from 'next/link';
import { GetPhone, isAdmin } from 'state/Users';
import { TextFormatted, formatMessage } from 'elements/Message';
import { CardButtonCustomFields } from '../ButtonType/CustomFields/CardButtonCustomFields';
import {
  CardSubmenu,
  CardSubmenuOption,
} from 'components/card/CardSubmenu';
import { FollowButton, UnfollowButton } from 'state/Follow';
import { AlertType, alertService } from 'services/Alert';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import { FixedAlert } from 'components/overlay/Alert';
import { maxZoom } from 'components/map/Map/Map.consts';
import { Button } from 'shared/entities/button.entity';
import MarkerViewMap from 'components/map/Map/MarkerSelectorMap';
import { TagsNav } from 'elements/Fields/FieldTags';
import { ImageGallery } from 'elements/ImageGallery';
import Loading from 'components/loading';
import { SetMainPopupCurrentProfile } from 'state/HomeInfo';
import React from 'react';
import dconsole from 'shared/debugger';
import { ButtonPin, ButtonUnpin } from 'state/Button';

export default function CardButton({ button, buttonTypes, toggleShowReplyFirstPost }) {
  const buttonType = useButtonType(button, buttonTypes);
  return (
    <>
      {!(button && buttonType) && <Loading />}
      {button && buttonType && (
        <>
          {/* <CardButtonOptions /> */}
          <div
            className="card-button card-button__file"
            style={buttonColorStyle(buttonType.cssColor)}
          >

            <div>
              {/* <Btn
              onClick={() => store.emit(new NextCurrentButton())}
              caption="next"
            ></Btn>
            <Btn
              onClick={() => store.emit(new PreviousCurrentButton())}
              caption="previous"
            ></Btn> */}
              <CardButtonHeadBig
                button={button}
                buttonTypes={buttonTypes}
                toggleShowReplyFirstPost={toggleShowReplyFirstPost}
              />
            </div>
          </div>
          <ImageGallery
            images={button?.images.map((image) => {
              return { src: image, alt: button.description };
            })}
          />

          <CardButtonAuthorSection
            button={button}
          />
        </>
      )}
    </>
  );
}

// card button list on explore
export function CardButtonHeadMedium({ button, buttonType }) {

  return (
    <div className="card-button__content card-button__content--small">
      <div className="card-button__header">
        {/* <div className="card-button__avatar">
          <div className="avatar-small">
            <ImageWrapper
              imageType={ImageType.avatar}
              src={button.owner.avatar}
              alt={button.owner.username}
            />
          </div>
        </div> */}

        <div className="card-button__info">
          <div className="card-button__status">
            {buttonType.icon && (
              <div className="card-button__emoji">
                {buttonType.icon}
              </div>
            )}
            <span
              className="card-button"
              style={buttonColorStyle(buttonType.cssColor)}
            >
              {buttonType.caption}
            </span>
          </div>
          {/* <div className="card-button__name">
            {button.owner.name}
            <span className="card-button__username">
              {' '}
              @{button.owner.username}
            </span>
          </div> */}
        </div>
      </div>

      <div className="card-button-list__title">{button.title}</div>
      {!button.image && (
        <div className="card-button-list__paragraph--small-card card-button-list__paragraph">
          <p>{button.description}</p>
          
        </div>
      )}
      {/* <div className="card-button__hashtags">
        {button.tags.map((tag, idx) => {
          return (
            <div className="hashtag" key={idx}>
              {tag}
            </div>
          );
        })}
      </div> */}
      
      <div className="card-button__custom-fields-container">
        {buttonType.customFields &&
          buttonType.customFields.length > 0 && (
            <CardButtonCustomFields
              customFields={buttonType.customFields}
              button={button}
            />
          )}
          
        <div className="card-button__city card-button__everywhere ">
          <IoLocationOutline/>
          {button.address}{' '}
          {button?.distance && (
            <> - {readableDistance(button?.distance)}</>
          )}
        </div>
      </div>
    </div>
  );
}



// Pin of the map
/*
export function CardButtonHeadSmall({ button }) {
  const { cssColor } = buttonTypes.find((buttonType) => {
    return buttonType.name === button.type;
  });
  return (
    <>
      <a href={`/ButtonFile/${button.id}`}>
        <div className="card-button-map__content">
          <div className="card-button-map__header">
            <div className="card-button-map__info">
              <div className="card-button__name">
                {button.owner.name}
              </div>

              <div className="card-button__status card-button__status">
                <span
                  className="card-button"
                  style={buttonColorStyle(cssColor)}
                >
                  {button.type}
                </span>
              </div>
            </div>
          </div>

          <div className="card-button__title">{button.title}</div>

          <div className="card-button__city card-button__everywhere ">
            {button.address}
          </div>
        </div>
      </a>
    </>
  );
}
*/
function CardButtonSubmenu({ button }) {
  const config: SetupDtoOut = useRef(
    store,
    (state: GlobalState) => state.config,
  );
  const sessionUser = useRef(
    store,
    (state: GlobalState) => state.sessionUser,
    false,
  );

  const [linkButton, setLinkButton] = useState(null);
  useEffect(() => {
    if (config) {
      setLinkButton(() => {
        return window ? window.location : getShareLink(`/?btn=${button.id}`);
      });
    }
  }, [config]);

  const FollowButtonMenuOption = (button) => {
    if (!canFollowButton(button, sessionUser)) {
      return;
    }

    if (isFollowingButton(button, sessionUser)) {
      return (
        <CardSubmenuOption
          onClick={() => {
            followButton(button.id);
          }}
          label={t('button.follow')}
        />
      );
    }
    return (
      <CardSubmenuOption
        onClick={() => {
          unFollowButton(button.id);
        }}
        label={t('button.unfollow')}
      />
    );
  };
  return (
    <CardSubmenu>
      <CardSubmenuOption
        onClick={() => {
          navigator.clipboard.writeText(linkButton);
          alertService.info(`${linkButton}`);
        }}
        label={t('button.copy')}
      />
      {FollowButtonMenuOption(button)}
      {(isButtonOwner(sessionUser, button) ||
        isAdmin(sessionUser)) && (
        <>
          <CardSubmenuOption
            onClick={() => {
              router.push(`/ButtonEdit/${button.id}`);
            }}
            label={t('button.edit')}
          />
          <CardSubmenuOption
            onClick={() => {
              router.push(`/ButtonRemove/${button.id}`);
            }}
            label={t('button.delete')}
          />
          <CardSubmenuOption
            onClick={() => {
              button.pin ? store.emit(new ButtonUnpin(button.id, () => alertService.success(t('button.unpinSuccess')))) : store.emit(new ButtonPin(button.id,() => alertService.success(t('button.pinSuccess'))))
            }}
            label={button.pin ? t('button.unpin') : t('button.pin')}
          />
        </>
      )}
    </CardSubmenu>
  );
}

function SendMessageButton({toggleShowReplyFirstPost, sessionUser})
{
  if(!sessionUser)
  {
    return ;
  }
  return <Btn
          btnType={BtnType.smallCircle}
          contentAlignment={ContentAlignment.center}
          iconLeft={IconType.circle}
          iconLink={<IoMailOutline />}
          onClick={()=> {
            toggleShowReplyFirstPost(true)
        }}
        />
}
export function CardButtonHeadBig({ button, buttonTypes, toggleShowReplyFirstPost }) {
  const { cssColor, caption, customFields, icon } = useButtonType(button, buttonTypes)
  const sessionUser = useRef(
    store,
    (state: GlobalState) => state.sessionUser,
    false,
  );
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <div className='card-button__head-actions'>
        <FollowButtonHeart
          button={button}
          sessionUser={sessionUser}
        />
        <SendMessageButton toggleShowReplyFirstPost={toggleShowReplyFirstPost} sessionUser={sessionUser}/>
        
        <CardButtonSubmenu button={button} />
      </div>
      <ExpiringAlert
        button={button}
        isOwner={isButtonOwner(sessionUser, button)}
      />
      {button.awaitingApproval && (
        <FixedAlert
          alertType={AlertType.Info}
          message={t('moderation.awaitingApproval')}
        />
      )}
      <div className="card-button__content card-button__full-content">
        <div className="card-button__header">
          <div className="card-button__info">
            <div className="card-button__status">
              {icon && (
                <div className="card-button__emoji">{icon}</div>
              )}
              <span
                className="card-button__status"
                style={buttonColorStyle(cssColor)}
              >
                {caption}
              </span>
            </div>
          </div>
        </div>

        <div className="card-button__title">
          {button.title}
        </div>

        <div className="card-button__paragraph">
          <TextFormatted text={button.description} />
        </div>
        <div className="card-button__hashtags">
          <TagsNav tags={button.tags} />
        </div>

        <div className="card-button__bottom-properties">
          {customFields && customFields.length > 0 && (
            <>
              <CardButtonCustomFields
                customFields={customFields}
                button={button}
              />
            </>
          )}
          <div
            className={
              'card-button__city card-button__everywhere' +
              (!button.hideAddress
                ? ' card-button__city--displayMap'
                : '')
            }
            onClick={() => setShowMap(() => !showMap)}
          >
            {<IoLocationOutline/>}
            {button.address}
          </div>
        </div>
        {!button.hideAddress && showMap && (
          <MarkerViewMap
            pickedPosition={[button.latitude, button.longitude]}
            zoom={maxZoom}
            markerColor={cssColor}
            markerImage={button.image}
            markerCaption={button.title}
          />
        )}
      </div>
    </>
  );
}

function ExpiringAlert({
  button,
  isOwner = false,
}: {
  button: Button;
  isOwner: boolean;
}) {
  if (!isOwner) {
    return;
  }
  if (!button.expired) {
    return;
  }

  if (isEventAndIsExpired(button)) {
    return (
      <FixedAlert
        alertType={AlertType.Info}
        message={`${t('button.endDatesExpired')}`}
      />
    );
  }
  return (
    <FixedAlert
      alertType={AlertType.Success}
      message={`${t('button.isExpiringLink')} <a href="/ButtonRenew/${button.id
        }">${t('button.renewLink')}</a>`}
    />
  );
}

export function ButtonOwnerPhone({ user, button }) {
  const [phone, setPhone] = useState(null);
  
  const showPhone = () => {
    store.emit(
        new GetPhone(
          user.id,
          (phone) => {
            setPhone(() => phone);
          },
          () => { },
        ),
      );
  }
  const jumpTo = (url) => {
    window.location.replace(url);
  }
  return (
    <>
      {user?.publishPhone && (
        <>
        {JSON.stringify(showPhone)}
          {!phone && 
            <Btn
              btnType={BtnType.corporative}
              contentAlignment={ContentAlignment.left}
              caption={t('button.showPhone')}
              iconLeft={IconType.svg}
              iconLink={<IoCallOutline />}
              onClick={showPhone}
            />
          }
          {phone && 
            <div className="card-button__phone-section">
            <Btn
              btnType={BtnType.filterCorp}
              contentAlignment={ContentAlignment.center}
              iconLeft={IconType.circle}
              iconLink={<IoCallOutline />}
              onClick={() => jumpTo(`tel:${phone}`)}
            />
              {phone}
            </div>
          }
          {user.showWassap &&
              <Btn
                btnType={BtnType.corporative}
                contentAlignment={ContentAlignment.left}
                caption={t('button.whatsapp')}
                iconLeft={IconType.svg}
                iconLink={<IoLogoWhatsapp />}
                onClick={() => jumpTo(`https://wa.me/+${phone}`)}
              />
          }

        </>
      )}
    </>
  );
}

export function CardButtonHeadActions({
  button,
  action,
  isButtonOwner,
}) {
  return (
    <>
      {action && !isButtonOwner && (
        <Btn
          btnType={BtnType.corporative}
          contentAlignment={ContentAlignment.left}
          iconLeft={IconType.svg}
          caption={t('button.sendPrivateMessage', [button.owner.name])}
          iconLink={<IoMailOutline />}
          submit={true}
          onClick={action}
        />
      )}
      {button.hearts && !isButtonOwner && (
        <span className="btn-circle__icon">
          <IoHeartOutline />
          {button.hearts}
        </span>
      )}

      {button.createdButtonsCount && (
        <span className="btn-circle__icon">
          <IoAddCircleOutline />
          {button.createdButtonsCount}
        </span>
      )}
    </>
  );
}

export function CardButtonAuthorSection({ button }) {
  const sessionUser = useGlobalStore((state: GlobalState) => state.sessionUser);
  const onClick = (e) => {
    e.preventDefault()
    if(sessionUser?.id == button.owner.id)
    {
      router.push('/Profile', undefined, {shallow: true})
    }else{
      store.emit(new SetMainPopupCurrentProfile(button.owner))
    }
    
  }
  return (
    <div className="card-button__author">
      <div className="card-button__avatar">
        <div className="avatar-big">
          <Link href="#" onClick={onClick}>
            <ImageWrapper
              imageType={ImageType.avatarBig}
              src={button.owner.avatar}
              alt="Avatar"
            />
          </Link>
        </div>
      </div>
      <div className="card-button__info">
        <Link href="#" onClick={onClick}>
          <div className="card-button__name">
          {t('button.authorTitle')}{button.owner.name}
          </div>
          <div className="card-button__author-description">
            <TextFormatted maxChars={600} text={button.owner.description} />
          </div>
        </Link>
      </div>
      
    </div>
  );
}


function FollowButtonHeart({ button, sessionUser }) {
  if (!canFollowButton(button, sessionUser)) {
    return;
  }

  if (isFollowingButton(button, sessionUser)) {
    return (
      <div className='card-button__follow-wrap'>
        {t('button.followme')}
        <Btn
          btnType={BtnType.iconActions}
          contentAlignment={ContentAlignment.center}
          iconLink={<IoHeartOutline />}
          iconLeft={IconType.circle}
          onClick={() => followButton(button.id)}
        />
      </div>  
    );
  }

  return (
    <div className='card-button__follow-wrap'>
      {t('button.following')}
      <Btn
        btnType={BtnType.iconActions}
        contentAlignment={ContentAlignment.center}
        iconLink={<IoHeart />}
        iconLeft={IconType.circle}
        onClick={() => unFollowButton(button.id)}
      />
    </div>  
  );
}

const canFollowButton = (button, user) => {
  if (!user) {
    return false;
  }

  if (user.id == button.owner.id) {
    return false;
  }
  return true;
};

const isFollowingButton = (button, user) => {
  return button.followedBy.indexOf(user.id) < 0;
};

const followButton = (buttonId) => {
  store.emit(
    new FollowButton(
      buttonId,
      () => alertService.success(t('button.followAlert')),
      () => {
        alertService.warn(t('button.followErrorAlert'));
      },
    ),
  );
};

const unFollowButton = (buttonId) => {
  store.emit(
    new UnfollowButton(
      buttonId,
      () => alertService.info(t('button.unfollowAlert')),
      () => {
        alertService.warn(t('button.unfollowErrorAlert'));
      },
    ),
  );
};
function isButtonOwner(sessionUser, button) {
  return (
    sessionUser && sessionUser.username == button.owner.username
  );
}
