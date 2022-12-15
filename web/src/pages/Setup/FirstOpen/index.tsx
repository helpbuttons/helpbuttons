import Popup from "components/popup/Popup";
import Btn, { BtnType, ContentAlignment } from "elements/Btn";
import Form from "elements/Form";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import { setupNextStep, SetupSteps } from "../../../shared/setupSteps";

export default FirstOpen;

function FirstOpen() {
    const {
        handleSubmit,
        formState: { isSubmitting },
      } = useForm({
        // defaultValues: {
        // }
      });
    
    const router = useRouter()

    const onSubmit = (data) => {
        setupNextStep(SetupSteps.INSTANCE_CREATION);
    };
    
    return (
    <>
      <Popup title="WELCOME TO YOUR HELPBUTTONS INSTANCE">
        <Form classNameExtra="createAdmin">
          <div className="form__btn-wrapper">
            <div><p>Here you´ll see your collaborative network description. </p><p>Create your first network with the options bellow.</p></div>
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