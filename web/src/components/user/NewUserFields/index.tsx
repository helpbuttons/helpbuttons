import { FieldCheckbox } from 'elements/Fields/FieldCheckbox';
import FieldPassword from 'elements/Fields/FieldPassword';
import FieldTags from 'elements/Fields/FieldTags';
import FieldText from 'elements/Fields/FieldText';
import t from 'i18n';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GlobalState, store } from 'state';
import { useEffect, useState } from 'react';
import { Network } from 'shared/entities/network.entity';
import { getHostname } from 'shared/sys.helper';
import { MainPopupPage, SetMainPopup } from 'state/HomeInfo';
import { useStore } from 'state';

export default function NewUserFields({
  register,
  errors,
  control,
  setValue,
  watch,
  short = false,
  isInitAdminForm=false,
}) {
  const [hostname, setHostname] = useState('');
  const [showUsername, setshowUsername] = useState(false);
  const selectedNetwork: Network = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  useEffect(() => {
    if (window) {
      setHostname(() => getHostname());
    }
  }, []);

  const router = useRouter();
  const params: URLSearchParams = new URLSearchParams(router.query);
  useEffect(() => {
    if (router?.query) {
      const follow = params.get('follow');
      if (follow) {
        setValue('tags', [params.get('follow')]);
      }
    }
  }, [router]);
  const name = watch('name');
  useEffect(() => {
    const nameToUsername = (name) => {
      let cleanName = name.toLowerCase().replace(/\s+/g, '_');

      if (!cleanName.match(/^[a-z]/i)) {
        cleanName =
          cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      }

      return cleanName;
    };
    if (name) {
      setValue('username', nameToUsername(name));
    }
  }, [name]);

  return (
    <>
      {!short && 
        <FieldText
          name="email"
          label={t('user.email')}
          explain={t('user.emailExplain')}
          classNameInput="squared"
          placeholder={t('user.emailPlaceHolder')}
          validationError={errors.email}
          {...register('email', { required: true })}
        ></FieldText>
      }
      <FieldText
        name="name"
        label={t('user.name')}
        explain={t('user.nameExplain')}
        classNameInput="squared"
        placeholder={t('user.namePlaceHolder')}
        validationError={errors.name}
        {...register('name', { required: true })}
      >
      { watch('username',) &&  !showUsername &&
          <div className="form__input-subtitle-side">
              <label className="form__input-subtitle--text">
                {`${t('user.usernameWillBe')}`} 
                <span className='highlight'>
                  {`${watch(
                    'username',
                  )}@${hostname}`}
                </span>
                  <span onClick={() => setshowUsername(true) } className="link">
                      {t('common.edit')}
                  </span> 
              </label>
          </div>
        }
      </FieldText>
      {showUsername &&
        <FieldText
          name="username"
          label={`${t('user.username')} ${watch(
            'username',
          )}@${hostname}`}
          explain={t('user.usernameCreateExplain')}
          classNameInput="squared"
          placeholder={t('user.usernamePlaceHolder')}
          validationError={errors.username}
          {...register('username', { required: true })}
        ></FieldText>
      }
      {!short &&
        <FieldPassword
        name="password"
        explain={t('user.passwordExplain')}
        label={t('user.password')}
        classNameInput="squared"
        placeholder={t('user.passwordPlaceHolder')}
        validationError={errors.password}
        {...register('password', { required: true, minLength: 8 })}
      ></FieldPassword>
      }
       {/* {short &&
        <FieldPassword
        name="password"
        explain={t('user.passwordExplain')}
        label={t('user.password')}
        classNameInput="squared"
        placeholder={t('user.passwordPlaceHolder')}
        validationError={errors.password}
        {...register('password', { minLength: 8 })}
      ></FieldPassword>
      } */}
      
      {selectedNetwork && !isInitAdminForm && (
          <FieldTags
            label={t('user.tags')}
            explain={t('user.tagsExplain')}
            placeholder={t('common.add')}
            validationError={errors.tags}
            setTags={(tags) => {
              setValue('tags', tags);
            }}
            tags={watch('tags')}
            maxTags={30}
          />
      )}
      {/* <FieldPassword
        name="password_confirm"
        label={t('user.passwordConfirmation')}
        classNameInput="squared"
        placeholder={t('user.passwordConfirmationPlaceHolder')}
        validationError={errors.password}
        {...register('password_confirm', {
          required: true,
          minLength: 8,
        })}
      ></FieldPassword> */}
      {t('user.acceptPrivacyPolicy')}<Link onClick={() => store.emit(new SetMainPopup(MainPopupPage.FAQS))} href="#">{t('user.privacyPolicyLink')}</Link>
      <FieldCheckbox
        name="acceptPrivacyPolicy"
        // defaultValue={watch('acceptPrivacyPolicy')}
        text={t('user.pressToAccept') }
        textOn={t('user.iAccept')}
        onChanged={(value) => {
          if(value)
          {
            setValue('acceptPrivacyPolicy', 'yes')
          }else{
            setValue('acceptPrivacyPolicy', 'no')
          }
        }
        }
        validationError={errors.acceptPrivacyPolicy ? {message: t('user.pleaseAcceptPrivacy')} : null}
        {...register('acceptPrivacyPolicy')}
      />
      
      {/* <Accordion title={t('user.signupOptions')}>
        <FieldLanguagePick onChange={(value) => setValue('locale', value)} explain={t('user.pickLanguageExplain')} defaultValue={getLocale()}/>
        <FieldImageUpload
          name="avatar"
          label={t('common.choose', ['avatar'])}
          explain={t('user.avatarExplain')}
          text={t('user.avatar')}
          control={control}
          width={150}
          height={150}
          validationError={errors.avatar}
          setValue={setValue}
          subtitle={'150x150px'}
          {...register('avatar')}
        />
        
      </Accordion> */}
    </>
  );
}

export function passwordsMatch(data, setError) {
  if (data.password != data.password_confirm) {
    const passwordsWontMatch = {
      type: 'custom',
      message: t('user.passwordMismatch'),
    };
    setError('password', passwordsWontMatch);
    setError('password_confirm', passwordsWontMatch);
    return false;
  }
  return true;
}
