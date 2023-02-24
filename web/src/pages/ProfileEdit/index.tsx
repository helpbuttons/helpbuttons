//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

//imported internal classes, variables, files or functions
import { GlobalState, store } from 'pages/index';
import { FetchUserData, UpdateProfile } from 'state/Users';

//imported react components
import { Link } from 'elements/Link';
import Popup from 'components/popup/Popup';
import Btn, {
  ContentAlignment,
  BtnType,
  IconType,
} from 'elements/Btn';
import Form from 'elements/Form';
import { NavigateTo } from 'state/Routes';
import { useRouter } from 'next/router';
import NewUserFields, {
  passwordsMatch,
} from 'components/user/NewUserFields';
import FieldText from 'elements/Fields/FieldText';
import FieldTags from 'elements/Fields/FieldTags';
import { alertService } from 'services/Alert';
import { User } from 'shared/entities/user.entity';
import { useRef } from 'store/Store';
import { FieldImageUpload } from 'elements/Fields/FieldImageUpload';
import FieldPassword from 'elements/Fields/FieldPassword';
import { getHostname } from 'shared/sys.helper';
import { UserUpdateDto } from 'shared/dtos/user.dto';
import { FieldTextArea } from 'elements/Fields/FieldTextArea';

export default function ProfileEdit() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({});
  const [errorMsg, setErrorMsg] = useState(undefined);
  const [setNewPassword, setSetNewPassword] = useState(false);

  const router = useRouter();

  const loggedInUser: User = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

  const onSubmit = (data: UserUpdateDto) => {
    const dataToSubmit : UserUpdateDto =
    {
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      password_current: data.password_current,
      password_new: data.password_new,
      password_new_confirm: data.password_new_confirm,
      set_new_password: setNewPassword,
      description: data.description
    }

    if (setNewPassword)  {
      // check passwords match.. send to backend
      if (dataToSubmit.password_new != dataToSubmit.password_new_confirm)
      {
        setError('password_new',  { type: 'custom', message: "new passwords won\'t match"})
        setError('password_new_confirm',  { type: 'custom', message: 'new passwords won\'t match'})
      }
    }
    
    store.emit(new UpdateProfile(dataToSubmit, onSuccess, onError));
  };

  const onSuccess = () => {
    store.emit(new FetchUserData(() => {router.push('/Profile')}, onError));
    ;
  };

  const onError = (errorMessage) => {
    alertService.error(errorMessage);
  };

  useEffect(() => {
    if (loggedInUser) {
      reset(loggedInUser);
    }
  }, [loggedInUser]);
  return (
    <>
      {loggedInUser && (
        <>
          <Popup title="Update profile" linkFwd="/HomeInfo">
            <Form
              onSubmit={handleSubmit(onSubmit)}
              classNameExtra="login"
            >
              <div>Edit my profile </div>
              {loggedInUser.username}@{getHostname()}
              <div className="login__form">
                <div className="form__inputs-wrapper">
                  <FieldText
                    name="name"
                    label="Profile name"
                    classNameInput="squared"
                    placeholder="Name"
                    validationError={errors.email}
                    {...register('name', { required: true })}
                  ></FieldText>
                  <FieldText
                    name="email"
                    label="Email"
                    classNameInput="squared"
                    placeholder="email@email.em"
                    validationError={errors.email}
                    {...register('email', { required: true })}
                  ></FieldText>
                  <FieldTextArea
                    name="description"
                    label="Description"
                    classNameInput="squared"
                    validationError={errors.description}
                    {...register('description', { required: true })}
                  />
                  
                  150x150px
                  <FieldImageUpload
                    name="avatar"
                    label="Choose avatar"
                    control={control}
                    width={150}
                    height={150}
                    validationError={errors.avatar}
                    setValue={setValue}
                    {...register('avatar', { required: true })}
                  />
                </div>
                {errorMsg && (
                  <div className="form__input-subtitle--error">
                    {errorMsg}
                  </div>
                )}



                <div className="form__btn-wrapper">
                <div
                    className="btn"
                    // onClick={() =>
                    //   setSetNewPassword(!setNewPassword)
                    // }                    
                  >
                    {!setNewPassword ? 'Set a new password': 'Don\'t change password' }
                    
                  </div>
                {setNewPassword && (
                    <>
                      <FieldPassword
                        name="password_current"
                        label="Password"
                        classNameInput="squared"
                        placeholder="Type your current password"
                        validationError={errors.password}
                        {...register('password_current', {
                          minLength: 8,
                        })}
                      ></FieldPassword>

                      <FieldPassword
                        name="password_new"
                        label="New password confirmation"
                        classNameInput="squared"
                        placeholder="Type your the new password you want"
                        validationError={errors.password}
                        {...register('password_new', {
                          minLength: 8,
                        })}
                      ></FieldPassword>
                       <FieldPassword
                        name="password_new_confirm"
                        label="New password confirmation"
                        classNameInput="squared"
                        placeholder="Type your new password again please"
                        validationError={errors.password}
                        {...register('password_new_confirm', {
                          minLength: 8,
                        })}
                      ></FieldPassword>
                    </>
                  )}
                  <Btn
                    btnType={BtnType.splitIcon}
                    caption="Save"
                    contentAlignment={ContentAlignment.center}
                    isSubmitting={isSubmitting}
                  />
                </div>
              </div>
            </Form>
          </Popup>
        </>
      )}
    </>
  );
}
