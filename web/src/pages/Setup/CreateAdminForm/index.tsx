// create admin!
// username
// email
// password

import Popup from "components/popup/Popup";
import Btn, { BtnType, ContentAlignment } from "elements/Btn";
import FieldPassword from "elements/Fields/FieldPassword";
import FieldText from "elements/Fields/FieldText";
import Form from "elements/Form";
import { store } from "pages";
import { useForm } from 'react-hook-form';
import { alertService } from "services/Alert";
import { CreateAdmin } from "state/Setup";
import { setupNextStep, SetupSteps } from "../steps";

export default CreateAdminForm;

function CreateAdminForm() {
    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        register,
        setError
      } = useForm({
        // defaultValues: {
        // }
      });
    
    const onSubmit = (data) => {
      if(data.password != data.password_confirm)
      {
        const passwordsWontMatch = { type: 'custom', message: 'passwords won\'t match' }
        setError('password',passwordsWontMatch)
        setError('password_confirm',passwordsWontMatch)
        return;
      }
      store.emit(new CreateAdmin({username: data.username,email: data.email, password: data.password}, 
        () => {
        setupNextStep(SetupSteps.FIRST_OPEN)
      }, 
      (err) => {
        console.log(JSON.stringify(err))
        alertService.error(`error.. ${JSON.stringify(err)}`)
      }));
    };
    
    return (
    <>
      <Popup title="Create Admin User">
        <Form classNameExtra="createAdmin">
          <div className="login__form">
                  <div className="form__inputs-wrapper">
                      <FieldText 
                        name="username" 
                        label="Name" 
                        classNameInput="squared"
                        validationError={ errors.username }
                        {...register("username", { required: true })}
                      ></FieldText>
                      <FieldText 
                        name="email" 
                        label="Email address" 
                        classNameInput="squared"
                        validationError={ errors.email }
                        {...register("email", { required: true })}
                      ></FieldText>
                      <FieldPassword 
                        name="password" 
                        label="Password" 
                        classNameInput="squared"
                        validationError={ errors.password }
                        {...register("password", { required: true, minLength: 8 })}
                      ></FieldPassword>
                      <FieldPassword 
                        name="password_confirm" 
                        label="Confirm password" 
                        classNameInput="squared"
                        validationError={ errors.password }
                        {...register("password_confirm", { required: true, minLength: 8 })}
                      ></FieldPassword>
                  </div>
                  </div>
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