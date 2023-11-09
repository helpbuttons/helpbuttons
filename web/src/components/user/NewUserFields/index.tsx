import {FieldImageUpload} from 'elements/Fields/FieldImageUpload';
import { FieldLanguagePick } from 'elements/Fields/FieldLanguagePick';
import FieldPassword from 'elements/Fields/FieldPassword';
import FieldText from 'elements/Fields/FieldText';
import t from 'i18n';
import { useEffect, useState } from 'react';
import { getHostname, getLocale } from 'shared/sys.helper';

export default function NewUserFields({
  register,
  errors,
  control,
  setValue,
  watch,
}) {
  const [hostname, setHostname] = useState('')
  useEffect(() => {
    if(window){
      setHostname(() => getHostname())
    }
  }, [])
  return (
    <>
      <FieldText
        name="email"
        label={t('user.email')}
        classNameInput="squared"
        placeholder={t('user.emailPlaceHolder')}
        validationError={errors.email}
        {...register('email', { required: true })}
      ></FieldText>
      <FieldText
        name="username"
        label={`${t('user.username')} ${watch('username')}@${
          hostname
        }`}
        classNameInput="squared"
        placeholder={t('user.usernamePlaceHolder')}
        validationError={errors.username}
        {...register('username', { required: true })}
      ></FieldText>
      <FieldPassword
        name="password"
        label={t('user.password')}
        classNameInput="squared"
        placeholder={t('user.passwordPlaceHolder')}
        validationError={errors.password}
        {...register('password', { required: true, minLength: 8 })}
      ></FieldPassword>
      <FieldPassword
        name="password_confirm"
        label={t('user.passwordConfirmation')}
        classNameInput="squared"
        placeholder={t('user.passwordConfirmationPlaceHolder')}
        validationError={errors.password}
        {...register('password_confirm', {
          required: true,
          minLength: 8,
        })}
      ></FieldPassword>
      
      <FieldLanguagePick onChange={(value) => setValue('locale', value)} explain={t('user.pickLanguageExplain')} defaultValue={getLocale()}/>
      <FieldImageUpload
        name="avatar"
        label={t('common.choose', ['avatar'])}
        explain={t('user.avatarExplain')}
        text={t('user.avatarExplain')}
        control={control}
        width={150}
        height={150}
        validationError={errors.avatar}
        setValue={setValue}
        subtitle={'150x150px'}
        {...register('avatar')}
      />
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
