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
  IoArchiveOutline,
  IoBalloonOutline,
  IoBanOutline,
  IoCheckmarkCircleOutline,
  IoHammerOutline,
  IoLogoSteam,
  IoPersonOutline,
  IoQrCodeOutline,
} from 'react-icons/io5';
import { alertService } from 'services/Alert';
import { readableTimeLeftToDate } from 'shared/date.utils';
import { Role } from 'shared/types/roles';
import { ButtonApprove, ButtonFindAll, ButtonModerationList } from 'state/Button';
import { ModerationList, UpdateRole } from 'state/Users';
import { getEmailPrefix, stringContains } from 'shared/sys.helper';
import { useButtonTypes } from 'shared/buttonTypes';
import { FindAndSetMainPopupCurrentProfile, SetMainPopupCurrentButton, SetMainPopupCurrentProfile } from 'state/HomeInfo';
import { Pagination, Table, TableBody, TableHeader, TableHeaderCell, TableLine, TableLineCell, useFilterItems } from 'components/table';
import FieldText from 'elements/Fields/FieldText';
import Invites from 'pages/Profile/Invites';

enum ModerationMode {
  USERS,
  APPROVAL,
  APPROVED,
  COMMUNICATION,
  QRINVITE
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
          <div className="form__header">
              {t('moderation.description')}
          </div>

          {mode == null && <div className='form__field--multiinput'>
            <Link href="#" onClick={() => setMode(ModerationMode.USERS)}>
              <Btn
                iconLeft={IconType.svg}
                iconLink={<IoPersonOutline />}
                caption={t('moderation.usersList')}
              />
            </Link>
            <Link href="#" onClick={() => setMode(ModerationMode.APPROVAL)}>
              <Btn
                iconLeft={IconType.svg}
                iconLink={<IoArchiveOutline />}
                caption={t('moderation.buttonsList')}
              />
            </Link>
            <hr></hr>

            <Link href="#" onClick={() => setMode(ModerationMode.APPROVED)}>
              <Btn
                iconLeft={IconType.svg}
                iconLink={<IoCheckmarkCircleOutline />}
                caption={t('moderation.buttonsApproved')}
              />
            </Link>
            <hr></hr>
            <Link href="/Profile/Invites">
                <Btn
                  iconLeft={IconType.svg}
                  iconLink={<IoQrCodeOutline/>}
                  caption={t('invite.title')}
                />
            </Link>
            <hr></hr>
            <Link href="#" onClick={() => setMode(ModerationMode.COMMUNICATION)}>
              <Btn
                iconLeft={IconType.svg}
                iconLink={<IoBalloonOutline />}
                caption={t('moderation.adminCommunication')}
              />
            </Link>
          </div>}


          {mode == ModerationMode.USERS && <ModerationUsersList />}
          {mode == ModerationMode.APPROVAL && <ModerationHelpButtonsList />}
          {mode == ModerationMode.APPROVED && <AprovedButtonsList />}
          {mode == ModerationMode.COMMUNICATION && <NewAdminCommunication />}

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
          updateUsersList();
        },
        () => {
          alertService.error(t('common.error'));
        },
      ),
    );
  };

  const [users, setUsers] = useState(null);
  const [pageUsers, setPageUsers] = useState(null);
  const [page, setPage] = useState(0);
  const [searchString, setSearchString] = useState('')

  const updateUsersList = () => {
    store.emit(
      new ModerationList(page, (usersList) =>
        {
          setPageUsers(usersList)
          setUsers(usersList)
        }
      ),
    );
  }
  useEffect(() => {
    updateUsersList();
  }, [page]);

  useFilterItems(setUsers, pageUsers, searchString, (searchStr, item) => stringContains(item.email, searchString) || stringContains(item.name,searchString))
  
  const onQueryChange = (query) => {
    setSearchString(() => query.target.value)
  }
  const openProfile = (username) =>  {
    store.emit(new FindAndSetMainPopupCurrentProfile(username))
  }
  return (
    <>
    <FieldText
            name="query"
            label={t('common.search')}
            onChange={onQueryChange}
          />
      {users?.length > 0 ? (
        <>
          
          <Table>
            <TableHeader>
              <TableHeaderCell>{t('user.email')}</TableHeaderCell>
              <TableHeaderCell>{t('user.name')}</TableHeaderCell>
              <TableHeaderCell>{t('moderation.role')}</TableHeaderCell>
              <TableHeaderCell>{t('moderation.verified')}</TableHeaderCell>
              <TableHeaderCell>{t('moderation.actions')}</TableHeaderCell>
            </TableHeader>
            <TableBody>
              {users.map((user, idx) => (
                <TableLine key={idx}>
                  <TableLineCell>
                    <Link href="#" onClick={() => openProfile(user.username)}>{user.email}</Link>
                  </TableLineCell>
                  <TableLineCell>
                    <Link href="#" onClick={() => openProfile(user.username)}>{user.username}</Link>
                  </TableLineCell>
                  <TableLineCell>
                    {t(`roles.${user.role}`)}
                  </TableLineCell>
                  <TableLineCell>
                    {user.verified ? (
                      <IoCheckmarkCircleOutline />
                    ) : (
                      <IoBanOutline />
                    )}
                  </TableLineCell>
                  <TableLineCell>
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
                        onClick={() => updateRole(user.id, Role.registered)}
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
                  </TableLineCell>
                </TableLine>
              ))
              }
            </TableBody>
          </Table></>) : t('moderation.emptyUsersList')}
      <Pagination page={page} setPage={setPage} array={users} take={10} />

    </>
  );
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
  const [pageButtons, setPageButtons] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    store.emit(
      new ButtonModerationList(page, (buttonsList) =>
        setButtons(buttonsList),
      ),
    );
  }, [page]);

  const approveButton = (buttonId) => {
    store.emit(
      new ButtonApprove(buttonId, () => {
        alertService.info('button approved');
        setButtons((prevButtons) => prevButtons.filter((button) => button.id != buttonId))
      })
    );
  }
  const buttonTypes = useButtonTypes();

  const [searchString, setSearchString] = useState('')
  const onQueryChange = (query) => {
    setSearchString(() => query.target.value)
  }
  useFilterItems(setButtons, pageButtons, searchString, (searchStr, item) => stringContains(item.email, searchString) || stringContains(item.name,searchString))


  return (
    <>
    <FieldText
            name="query"
            label={t('common.search')}
            onChange={onQueryChange}
          />
      {buttons?.length > 0 ? (
        <Table>
        <TableHeader>
          <TableHeaderCell>{t('moderation.created_at')}</TableHeaderCell>
          <TableHeaderCell>{t('button.titleLabel')}</TableHeaderCell>
          <TableHeaderCell>{t('button.typeLabel')}</TableHeaderCell>
          <TableHeaderCell>{t('button.tagsLabel')}</TableHeaderCell>
          <TableHeaderCell>{t('button.whereLabel')}</TableHeaderCell>
          <TableHeaderCell>{t('moderation.actions')}</TableHeaderCell>
        </TableHeader>
        <TableBody>
          {buttons.map((button, idx) => (
            <TableLine idx={idx}>
              <TableLineCell>
                {readableTimeLeftToDate(button.created_at)}
              </TableLineCell>
              <TableLineCell>
                {button.title}
              </TableLineCell>
              <TableLineCell>
                <BtnButtonType type={buttonTypes.find((type) => type.name == button.type)} />
              </TableLineCell>
              <TableLineCell>
                <TagsNav tags={button.tags} />
              </TableLineCell>
              <TableLineCell>
                {button.address}
              </TableLineCell>
              <TableLineCell>
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
              </TableLineCell>
            </TableLine>
          ))}
        </TableBody>
        </Table>
      ) : t('moderation.emptyButtonList')}
      <Pagination page={page} setPage={setPage} array={buttons} take={10} />

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
  const [pageButtons, setPageButtons] = useState(null);

  const [page, setPage] = useState(0);

  useEffect(() => {
    store.emit(
      new ButtonFindAll(page, (buttonsList) =>
        {setButtons(buttonsList);
        setPageButtons(buttonsList)}
      ),
    );
  }, [page]);

  const approveButton = (buttonId) => {
    store.emit(
      new ButtonApprove(buttonId, () => {
        alertService.info('button approved');
        setButtons((prevButtons) => prevButtons.filter((button) => button.id != buttonId))
      })
    );
  }
  const buttonTypes = useButtonTypes();

  const [searchString, setSearchString] = useState('')
  const onQueryChange = (query) => {
    setSearchString(() => query.target.value)
  }
  useFilterItems(setButtons, pageButtons, searchString, (searchStr, item) => stringContains(item.title, searchString))

  return (
    <>
        <FieldText
            name="query"
            label={t('common.search')}
            onChange={onQueryChange}
          />
      {buttons?.length > 0 ? (
        <div className='form-list__wrapper'>
          {/* <FieldText
            name="query"
            placeholder={t('common.search')}
            {...register('query')}
          /> */}


          <table className='form-list__table'>
            <thead className='form-list__table-header'>
              <tr className='form-list__table-header-row'>
                <th className='form-list__table-header-cell'>{t('button.titleLabel')}</th>
                <th className='form-list__table-header-cell'>{t('button.typeLabel')}</th>
                <th className='form-list__table-header-cell'>{t('button.tagsLabel')}</th>
                <th className='form-list__table-header-cell'>{t('moderation.created_at')}</th>
                <th className='form-list__table-header-cell'>{t('button.authorTitle')}</th>
                <th className='form-list__table-header-cell'>{t('moderation.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {buttons.map((button, idx) => (
                <tr className='form-list__table-body-row'>
                  <td className='form-list__table-body-cell'>{button.title}</td>
                  <td className='form-list__table-body-cell'>
                    <BtnButtonType type={buttonTypes.find((type) => type.name == button.type)} />
                  </td>
                  <td className='form-list__table-body-cell'><TagsNav tags={button.tags} /></td>
                  <td className='form-list__table-body-cell'>{readableTimeLeftToDate(button.updated_at)}</td>
                  <td className='form-list__table-body-cell'><a onClick={() => store.emit(new SetMainPopupCurrentProfile(button.owner))}>{button.owner.name}</a></td>
                  <td className='form-list__table-body-cell'>
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
      <Pagination page={page} setPage={setPage} array={buttons} take={10} />


    </>
  );
}

function NewAdminCommunication() {
  return <>
    <div className="form__inputs-wrapper form__subsection">
      <div className="form__field">
        <div className="form__label">{t('moderation.adminCommunicationLabel')}</div>
        <div className="form__explain">{t('moderation.adminCommunicationExplain')}</div>
        <MessageNew onCreate={undefined} isComment={true} />
      </div>
    </div></>
}
