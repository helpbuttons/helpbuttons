import Popup from 'components/popup/Popup';
import { LinkProfile } from 'components/user/LinkProfile';
import Accordion from 'elements/Accordion';
import Btn, { BtnAction, BtnCaption, BtnType, ContentAlignment, IconType } from 'elements/Btn';
import FieldText from 'elements/Fields/FieldText';
import Form from 'elements/Form';
import t from 'i18n';
import { store } from 'pages';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoBanOutline, IoCheckmarkCircleOutline, IoCloseOutline, IoTrashBinOutline } from 'react-icons/io5';
import { Role } from 'shared/types/roles';
import { ModerationList } from 'state/Users';

export default function Moderation() {
  const [moderationList, setModerationList] = useState(null);
  useEffect(() => {
    if (moderationList === null) {
      store.emit(
        new ModerationList((moderationList) =>
          setModerationList(moderationList),
        ),
      );
    }
  }, [moderationList]);
  return (
    <>
      <Popup
        title={t('configuration.moderationList')}
        linkBack="/Profile"
      >
        <div className="form__inputs-wrapper">
          <div className="form__field">
            <p className="form__explain">{t('moderation.description')}</p>
            <p>
              <b>{t('moderation.title')}</b>
            </p>
          </div>

          <Accordion
            title={t('moderation..users')}
          >
            <ModerationUsersList />
          </Accordion>
          <Accordion
            title={t('moderation.buttons')}
          ></Accordion>
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
  
  const users = [
    {
      username: 'marco paulo',
      email: 'zzz@comoderation.com',
      name: 'lal alkdsad',
      role: Role.admin,
      verified: true,
    },
    {
      username: 'andre',
      email: 'kkk@comoderation.com',
      name: 'asdhgkas lal alkdsad',
      role: Role.registered,
      verified: false,
    },
    {
      username: 'dias',
      email: 'xxx@comoderation.com',
      name: 'lal alkdsad',
      role: Role.admin,
      verified: false,
    },
  ];
  return (
    <>
      {/* <div className="form__list--button-type-field">
        
      <div
              className="form__list-item--button-type-field"
            > */}
              <FieldText
                      name="query"
                      // label={t('moderation.userSearchLabel')}
                      placeholder={t('common.search')}
                      // explain={t('moderation.userSearchExplain')}
                      {...register('query')}
                    />
      <table>
        <thead>
          <tr>
            <th>{t('moderation.email')}</th>
            <th>{t('moderation.name')}</th>
            <th>{t('moderation.role')}</th>
            <th>{t('moderation.verified')}</th>
            <th>{t('moderation.actions')}</th>
          </tr>
        </thead>
        {/* </div> */}
        <tbody>
          {users?.length > 0 &&
            users.map((user, idx) => (
              <tr>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.verified ? <IoCheckmarkCircleOutline/> :  <IoBanOutline/> }</td>
                <td> 
                  {/* <BtnAction
                      icon={<IoTrashBinOutline />}
                      onClick={() => console.log('desativar')}
                    /> */}
                  <BtnCaption color={'green'} caption={t('moderation.promote')} icon={null} onClick={() => console.log('deactive user')}/>
                  <BtnCaption color={'orange'} caption={t('moderation.deactivate')} icon={null} onClick={() => console.log('deactive user')}/>
                  <BtnCaption color={'red'} caption={t('moderation.remove')} icon={null} onClick={() => console.log('deactive user')}/>

                  </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* </div> */}
      {/* ))} */}
      {/* </div> */}
    </>
  );
}
