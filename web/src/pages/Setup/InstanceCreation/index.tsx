// here we have the basic configuration of an instance
import Popup from "components/popup/Popup";
import Btn, { BtnType, ContentAlignment } from "elements/Btn";
import Form from "elements/Form";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import { localStorageService, LocalStorageVars } from "services/LocalStorage";

// name, description, logo, background image, button template, color pallete, colors
export default InstanceCreation;

function InstanceCreation() {
    const {
        handleSubmit,
        formState: { isSubmitting },
      } = useForm({
        // defaultValues: {
        // }
      });
    
    const router = useRouter()

    const onSubmit = (data) => {
        localStorageService.remove(LocalStorageVars.SETUP_STEP);
        router.replace('/HomeInfo')
    };
    
    return (
    <>
      <Popup title="Configure instance">
        <Form classNameExtra="createAdmin">
          <div className="form__btn-wrapper">
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
    </>
    );
}