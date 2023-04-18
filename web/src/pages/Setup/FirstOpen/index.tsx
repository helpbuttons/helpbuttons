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

export default FirstOpen;

function FirstOpen() {
  const loggedInUser = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
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
      {loggedInUser?.role == Role.admin && (
        <Popup title={t('setup.welcomeMessage')}>
          <Form classNameExtra="createAdmin">
            <div className="form__btn-wrapper">
              <div>
                {t('setup.welcomeMessageLong')}
                
              </div>
              <Btn
                btnType={BtnType.splitIcon}
                caption={t('common.next')}
                contentAlignment={ContentAlignment.center}
                isSubmitting={isSubmitting}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          </Form>
        </Popup>
      )}
    </>
  );
}
