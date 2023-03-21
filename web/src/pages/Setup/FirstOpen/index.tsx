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
        <Popup title="WELCOME TO YOUR HELPBUTTONS INSTANCE">
          <Form classNameExtra="createAdmin">
            <div className="form__btn-wrapper">
              <div>
                <p>
                  Here you´ll see your collaborative network
                  description.{' '}
                </p>
                <p>
                  Create your first network with the options bellow.
                </p>
              </div>
              <Btn
                btnType={BtnType.splitIcon}
                caption="NEXT"
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
