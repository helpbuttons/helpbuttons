import Popup from 'components/popup/Popup';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import Form from 'elements/Form';
import { useRouter } from 'next/router';
import { GlobalState, store } from 'pages';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Role } from 'shared/types/roles';
import { useRef } from 'store/Store';
import { SetupSteps } from '../../../shared/setupSteps';
import t from 'i18n';
import Link from 'next/link';

export default FirstOpen;

function FirstOpen() {
  const sessionUser = useRef(
    store,
    (state: GlobalState) => state.sessionUser,
  );

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    // defaultValues: {
    // }
  });

  const router = useRouter();

  const onSubmit = (data) => {
    router.push({
      pathname: SetupSteps.NETWORK_CREATION,
    });
  };

  return (
    <>
      {sessionUser?.role == Role.admin && (
        <Popup title={t('setup.welcomeMessage')}>
          <Form classNameExtra="create-admin">
            <div className='form__field'>
              <div className='form__label'>
                {t('setup.welcomeMessageLong')}
              </div>
            </div>
            <div className="form__btn-wrapper">
              <Btn
                submit={true}
                btnType={BtnType.submit}
                caption={t('common.next')}
                contentAlignment={ContentAlignment.center}
                isSubmitting={isSubmitting}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          </Form>
        </Popup>
      )}
      {!sessionUser && 
        <Link href="/Login">Please login here</Link>
      }
    </>
  );
}
