import Popup from "components/popup/Popup";
import Btn, { BtnType, ContentAlignment } from "elements/Btn";
import Form from "elements/Form";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';

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
        router.replace('/Setup/InstanceCreation')
    };
    
    return (
    <>
      <Popup title="First Open :D explain what is an instance">
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