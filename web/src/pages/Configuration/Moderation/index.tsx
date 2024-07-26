import Popup from 'components/popup/Popup';
import Accordion from 'elements/Accordion';
import {
  BtnAction,
  BtnCaption,
} from 'elements/Btn';
import t from 'i18n';
import Link from 'next/link';
import router from 'next/router';
import { store } from 'pages';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  IoArrowBack,
  IoArrowForward,
  IoBanOutline,
  IoCheckmarkCircleOutline,
} from 'react-icons/io5';
import { alertService } from 'services/Alert';
import { Role } from 'shared/types/roles';
import { ButtonApprove, ButtonModerationList } from 'state/Button';
import { ModerationList, UpdateRole } from 'state/Users';

export default function Moderation() {
  
  return (
    <>
      <Popup
        title={t('configuration.moderationList')}
        linkBack="/Profile"
      >
        <div className="form__inputs-wrapper">
          <div className="form__field">
            <p className="form__explain">
              {t('moderation.description')}
            </p>
            <p>
              <b>{t('moderation.title')}</b>
            </p>
          </div>

          <Accordion title={t('moderation.usersList')}>
            <ModerationUsersList />
          </Accordion>
          <Accordion
            title={t('moderation.buttonsList')}
          >
            <ModerationHelpButtonsList />
          </Accordion>
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
      <table>
        <thead>
          <tr>
            <th>{t('user.email')}</th>
            <th>{t('user.name')}</th>
            <th>{t('moderation.role')}</th>
            <th>{t('moderation.verified')}</th>
            <th>{t('moderation.actions')}</th>
          </tr>
        </thead>
        <tbody>
            {users.map((user, idx) => (
              <tr key={idx}>
                <td><Link href={`/p/${user.username}`}>{user.email}</Link></td>
                <td><Link href={`/p/${user.username}`}>{user.name}</Link></td>
                <td>{user.role}</td>
                <td>
                  {user.verified ? (
                    <IoCheckmarkCircleOutline />
                  ) : (
                    <IoBanOutline />
                  )}
                </td>
                <td>
                  {user.role == Role.registered &&
                    <BtnCaption
                      color={'green'}
                      caption={t('moderation.promote')}
                      icon={null}
                      onClick={() => updateRole(user.id, Role.admin)}
                    />
                  }
                  {user.role == Role.admin && 
                    <BtnCaption
                      color={'red'}
                      caption={t('moderation.revoke')}
                      icon={null}
                      onClick={() =>  updateRole(user.id, Role.registered)}
                    />
                  }
                  {user.role == Role.registered &&
                    <BtnCaption
                      color={'orange'}
                      caption={t('moderation.deactivate')}
                      icon={null}
                      onClick={() => updateRole(user.id, Role.blocked)}
                    />
                  }
                  {user.role == Role.blocked &&
                    <BtnCaption
                      color={'green'}
                      caption={t('moderation.activate')}
                      icon={null}
                      onClick={() => updateRole(user.id, Role.registered)}
                    />
                  }
                  {/* <BtnCaption
                    color={'red'}
                    caption={t('moderation.remove')}
                    icon={null}
                    onClick={() => console.log('remove user')}
                  /> */}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
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
  
  return (
    <>
      {buttons?.length > 0 ? (
        <>
          {/* <FieldText
            name="query"
            placeholder={t('common.search')}
            {...register('query')}
          /> */}
          <table>
            <thead>
              <tr>
                <th>{t('moderation.title')}</th>
                <th>{t('moderation.type')}</th>
                <th>{t('moderation.tags')}</th>
                <th>{t('moderation.place')}</th>
                <th>{t('moderation.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {buttons.map((button, idx) => (
                <tr>
                  <td>{button.title}</td>
                  <td>{button.type}</td>
                  <td>#{button.tags.join(' #')}</td>
                  <td>{button.address}</td>
                  <td>
                    {button.awaitingApproval == true && 
                      <BtnCaption
                        color={'green'}
                        caption={t('moderation.confirm')}
                        icon={null}
                        onClick={() => approveButton(button.id)}
                      />
                    }
                    <Link href={`/ButtonFile/${button.id}`}>
                      <BtnCaption
                        color={'green'}
                        caption={t('moderation.preview')}
                        icon={null}
                        onClick={() => {}}
                      />
                    </Link>
                    <Link href={`/ButtonEdit/${button.id}`}>
                      <BtnCaption
                        color={'orange'}
                        caption={t('button.edit')}
                        icon={null}
                        onClick={() => console.log('edit button')}
                      />
                    </Link>
                    {/* <BtnCaption
                      color={'red'}
                      caption={t('moderation.remove')}
                      icon={null}
                      onClick={() => console.log('remove button')}
                    /> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : t('moderation.emptyButtonList')}
      <Pagination page={page} setPage={setPage} array={buttons} take={10}/>

    </>
  );
}
