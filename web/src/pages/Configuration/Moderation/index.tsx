import MessageNew from 'components/feed/MessageNew';
import { BtnButtonType } from 'components/nav/ButtonTypes';
import Popup from 'components/popup/Popup';
import Accordion from 'elements/Accordion';
import Btn, {
  BtnAction,
  BtnCaption,
  BtnType,
  IconType,
} from 'elements/Btn';
import { TagsNav } from 'elements/Fields/FieldTags';
import t from 'i18n';
import Link from 'next/link';
import router from 'next/router';
import { store } from 'state';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  IoArrowBack,
  IoArrowForward,
  IoBanOutline,
  IoCheckmarkCircleOutline,
  IoHammerOutline,
} from 'react-icons/io5';
import { alertService } from 'services/Alert';
import { readableTimeLeftToDate } from 'shared/date.utils';
import { Role } from 'shared/types/roles';
import { ButtonApprove, ButtonFindAll, ButtonModerationList } from 'state/Button';
import { ModerationList, UpdateRole } from 'state/Users';
import { getEmailPrefix } from 'shared/sys.helper';
import { useButtonTypes } from 'shared/buttonTypes';
import { SetMainPopupCurrentButton, SetMainPopupCurrentProfile } from 'state/HomeInfo';

enum ModerationMode {
  USERS,
  APPROVAL,
  APPROVED,
  COMMUNICATION
}
export default function Moderation() {
  
  const [mode, setMode] = useState(null)

  return (
    <>
      <Popup
        title={t('configuration.moderationList')}
        linkBack={mode == null ? "/Profile" : () => setMode(null)}
      >
        <div className="form__inputs-wrapper">
          <div className="form__field">
            <p className="form__explain">
              {t('moderation.description')}
            </p>
          </div>

          {mode == null && <>
            <Link href="#" onClick={() => setMode(ModerationMode.USERS)}>
              <Btn
                iconLeft={IconType.svg}
                iconLink={<IoHammerOutline />}
                caption={t('moderation.usersList')}
              />
            </Link>
            <Link href="#" onClick={() => setMode(ModerationMode.APPROVAL)}>
              <Btn
                iconLeft={IconType.svg}
                iconLink={<IoHammerOutline />}
                caption={t('moderation.buttonsList')}
              />
            </Link>
            <Link href="#" onClick={() => setMode(ModerationMode.APPROVED)}>
              <Btn
                iconLeft={IconType.svg}
                iconLink={<IoHammerOutline />}
                caption={t('moderation.buttonsApproved')}
              />
            </Link>
            <Link href="#" onClick={() => setMode(ModerationMode.COMMUNICATION)}>
              <Btn
                iconLeft={IconType.svg}
                iconLink={<IoHammerOutline />}
                caption={t('moderation.adminCommunication')}
              />
            </Link>
          </>}
          

          {mode == ModerationMode.USERS && <ModerationUsersList /> }
          {mode == ModerationMode.APPROVAL && <ModerationHelpButtonsList /> }
          {mode == ModerationMode.APPROVED && <AprovedButtonsList /> }
          {mode == ModerationMode.COMMUNICATION && <NewAdminCommunication /> }
        </div>
      </Popup>
    </>
  );
}

function ModerationUsersList() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setValue,
    watch,
    reset,
  } = useForm();

  const updateRole = (userId, newRole) => {
    store.emit(
      new UpdateRole(
        userId,
        newRole,
        () => {
          alertService.info(t('common.done'));
        },
        () => {
          alertService.error(t('common.error'));
        },
      ),
    );
  };

  const [users, setUsers] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    store.emit(
      new ModerationList(page,(usersList) =>
        setUsers(usersList),
      ),
    );
  }, [page]);
  return (
    <>
      {users?.length > 0 ? (<>
      {/* <FieldText
        name="query"
        placeholder={t('common.search')}
        {...register('query')}
      /> */}
      <div className='user-list__wrapper'>
        <table className='user-list__table'>
          <thead className='user-list__table-header'>
            <tr className='user-list__table-header-row'>
              <th className='user-list__table-header-cell'>{t('user.email')}</th>
              <th className='user-list__table-header-cell'>{t('user.name')}</th>
              <th className='user-list__table-header-cell'>{t('moderation.role')}</th>
              <th className='user-list__table-header-cell'>{t('moderation.verified')}</th>
              <th className='user-list__table-header-cell'>{t('moderation.actions')}</th>
            </tr>
          </thead>
          <tbody className='user-list__table-body'>
              {users.map((user, idx) => (
                <tr className='user-list__table-body-row' key={idx}>

                  <td className='user-list__table-body-cell--email'>

                      <Link href={`/p/${user.username}`}>{getEmailPrefix(user.email)}</Link> 
            
                  </td>
                  <td className='user-list__table-body-cell'><Link href={`/p/${user.username}`}>{user.username}</Link></td>
                  <td className='user-list__table-body-cell'>{t(`roles.${user.role}`)}</td>
                  <td className='user-list__table-body-cell'>
                    {user.verified ? (
                      <IoCheckmarkCircleOutline />
                    ) : (
                      <IoBanOutline />
                    )}
                  </td>
                  <td className='user-list__table-body-cell'>
                    {user.role == Role.registered &&
                      <Btn
                        btnType={BtnType.small}

                        borderColor={'green'}
                        caption={t('moderation.promote')}
                        iconLink={null}
                        onClick={() => updateRole(user.id, Role.admin)}
                      />
                    }
                    {user.role == Role.admin && 
                      <Btn
                        btnType={BtnType.small}
                        borderColor={'red'}
                        caption={t('moderation.revoke')}
                        iconLink={null}
                        onClick={() =>  updateRole(user.id, Role.registered)}
                      />
                    }
                    {user.role == Role.registered &&
                      <Btn
                        btnType={BtnType.small}
                        borderColor={'orange'}
                        caption={t('moderation.block')}
                        iconLink={null}
                        onClick={() => updateRole(user.id, Role.blocked)}
                      />
                    }
                    {user.role == Role.blocked &&
                      <Btn
                        btnType={BtnType.small}
                        borderColor={'green'}
                        caption={t('moderation.activate')}
                        iconLink={null}
                        onClick={() => updateRole(user.id, Role.registered)}
                      />
                    }
                    {/* <BtnCaption
                      color={'red'}
                      caption={t('moderation.remove')}
                      icon={null}
                      onClick={() => dconsole.log('remove user')}
                    /> */}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      </>) : t('moderation.emptyUsersList')}
      <Pagination page={page} setPage={setPage} array={users} take={10}/>
      
    </>
  );
}

function Pagination({page, setPage, array, take})
{
  return (<>
    {page > 0 &&
      <BtnAction
      icon={<IoArrowBack/>}
      onClick={() => setPage((prevPage) => prevPage-1)}
      />
    }
    {(array && array.length > 0 && array.length == take) &&
      <BtnAction
        icon={<IoArrowForward/>}
        onClick={() => setPage((prevPage) => prevPage+1)}
      />
    }
    </>
  )
}
function ModerationHelpButtonsList() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setValue,
    watch,
    reset,
  } = useForm();


  const [buttons, setButtons] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    store.emit(
      new ButtonModerationList(page,(buttonsList) =>
        setButtons(buttonsList),
      ),
    );
  }, [page]);

  const approveButton = (buttonId) => {
      store.emit(
        new ButtonApprove(buttonId,() =>
        {
          alertService.info('button approved');
          setButtons((prevButtons) => prevButtons.filter((button) => button.id != buttonId))
        })
      );
    }
  const buttonTypes = useButtonTypes();

  return (
    <>
      {buttons?.length > 0 ? (
        <div className='user-list__wrapper'>
          {/* <FieldText
            name="query"
            placeholder={t('common.search')}
            {...register('query')}
          /> */}
         
          <table className='user-list__table'>
            <thead className='user-list__table-header'>
              <tr className='user-list__table-header-row'>
                <th className='user-list__table-header-cell'>{t('moderation.created_at')}</th>
                <th className='user-list__table-header-cell'>{t('button.titleLabel')}</th>
                <th className='user-list__table-header-cell'>{t('button.typeLabel')}</th>
                <th className='user-list__table-header-cell'>{t('button.tagsLabel')}</th>
                <th className='user-list__table-header-cell'>{t('button.whereLabel')}</th>
                <th className='user-list__table-header-cell'>{t('moderation.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {buttons.map((button, idx) => (
                <tr className='user-list__table-body-row'>
                  <td className='user-list__table-body-cell'>{readableTimeLeftToDate(button.created_at)}</td>
                  <td className='user-list__table-body-cell'>{button.title}</td>
                  <td className='user-list__table-body-cell'>
                    <BtnButtonType type={buttonTypes.find((type) => type.name == button.type)}/>
                  </td>
                  <td className='user-list__table-body-cell'><TagsNav tags={button.tags}/></td>
                  <td className='user-list__table-body-cell'>{button.address}</td>
                  <td className='user-list__table-body-cell'>
                      <Btn
                      btnType={BtnType.small}

                      borderColor={'green'}
                      caption={t('moderation.confirm')}
                      iconLink={null}
                      onClick={() => approveButton(button.id)}
                    />
                    <Btn
                      btnType={BtnType.small}
                      borderColor={'green'}
                      caption={t('moderation.preview')}
                      iconLink={null}
                      onClick={(e) => {
                        e.preventDefault()
                        store.emit(new SetMainPopupCurrentButton(button))
                      }}
                    />
                    <Btn
                      btnType={BtnType.small}
                      borderColor={'orange'}
                      caption={t('moderation.edit')}
                      iconLink={null}
                      onClick={() => router.push(`/ButtonEdit/${button.id}`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : t('moderation.emptyButtonList')}
      <Pagination page={page} setPage={setPage} array={buttons} take={10}/>

    </>
  );
}


function AprovedButtonsList() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setValue,
    watch,
    reset,
  } = useForm();


  const [buttons, setButtons] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    store.emit(
      new ButtonFindAll(page,(buttonsList) =>
        setButtons(buttonsList),
      ),
    );
  }, [page]);

  const approveButton = (buttonId) => {
      store.emit(
        new ButtonApprove(buttonId,() =>
        {
          alertService.info('button approved');
          setButtons((prevButtons) => prevButtons.filter((button) => button.id != buttonId))
        })
      );
    }
  const buttonTypes = useButtonTypes();


  return (
    <>
      {buttons?.length > 0 ? (
        <div className='user-list__wrapper'>
          {/* <FieldText
            name="query"
            placeholder={t('common.search')}
            {...register('query')}
          /> */}
         
          
         <table className='user-list__table'>
            <thead className='user-list__table-header'>
              <tr className='user-list__table-header-row'>
                <th className='user-list__table-header-cell'>{t('button.titleLabel')}</th>
                <th className='user-list__table-header-cell'>{t('button.typeLabel')}</th>
                <th className='user-list__table-header-cell'>{t('button.tagsLabel')}</th>
                <th className='user-list__table-header-cell'>{t('moderation.created_at')}</th>
                <th className='user-list__table-header-cell'>{t('button.authorTitle')}</th>
                <th className='user-list__table-header-cell'>{t('moderation.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {buttons.map((button, idx) => (
                <tr className='user-list__table-body-row'>
                  <td className='user-list__table-body-cell'>{button.title}</td>
                  <td className='user-list__table-body-cell'>
                    <BtnButtonType type={buttonTypes.find((type) => type.name == button.type)}/>
                  </td>
                  <td className='user-list__table-body-cell'><TagsNav tags={button.tags}/></td>
                  <td className='user-list__table-body-cell'>{readableTimeLeftToDate(button.updated_at)}</td>
                  <td className='user-list__table-body-cell'><a onClick={() => store.emit(new SetMainPopupCurrentProfile(button.owner))}>{button.owner.name}</a></td>
                  <td className='user-list__table-body-cell'>
                    <Btn
                      btnType={BtnType.small}
                      borderColor={'green'}
                      caption={t('moderation.view')}
                      iconLink={null}
                      onClick={(e) => {
                        e.preventDefault()
                        store.emit(new SetMainPopupCurrentButton(button))
                      }}
                    />
                    <Btn
                      btnType={BtnType.small}
                      borderColor={'orange'}
                      caption={t('moderation.edit')}
                      iconLink={null}
                      onClick={() => router.push(`/ButtonEdit/${button.id}`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : t('moderation.emptyButtonList')}
      <Pagination page={page} setPage={setPage} array={buttons} take={10}/>


    </>
  );
}

function NewAdminCommunication() {
  return <>
  <div className="form__inputs-wrapper">
                <div className="form__field">
                  <div className="form__label">{t('moderation.adminCommunicationLabel')}</div>
                  <div className="form__explain">{t('moderation.adminCommunicationExplain')}</div>
                  <MessageNew onCreate={undefined}/>
                              
                </div>
            </div></>
}
