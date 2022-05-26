//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper'

//imported internal classes, variables, files or functions
import { store } from 'pages/index';
import { SignupEvent } from 'pages/Signup/data';

//imported react components
import Alert from 'components/overlay/Alert';
import { Link } from 'elements/Link';
import Popup from 'components/popup/Popup';
import Btn, {ContentAlignment, BtnType, IconType} from 'elements/Btn'
import FieldText from 'elements/Fields/FieldText';
import FieldPassword from 'elements/Fields/FieldPassword';


export default function Signup() {
  const fields = {
    email: "",
    password: "",
  };
  const [values, setValues] = useState(fields);
  const [validationErrors, setValidationErrors] = useState(fields);

  const {formState: { isSubmitting }} = useForm()

  const setValue = (name, value) => {
    setValues({ ...values, [name]: value });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    store.emit(new SignupEvent(values.email, values.password, setValidationErrors));
  };

  return (

        <Popup title="Signup" linkFwd="/HomeInfo">

          <Alert />

                <div className="popup__img">

                  <ImageWrapper imageType={ImageType.popup} src="https://dummyimage.com/80/#ccc/fff" alt="register_img"/>

                </div>

                <div className="popup__section">

                    <form onSubmit={handleSubmit}>
                      <FieldText handleChange={setValue} value={values.email} name="email" label="Email" validationError={validationErrors.email}></FieldText>
                      <FieldPassword handleChange={setValue} value={values.password} name="password" label="Password" validationError={validationErrors.password}></FieldPassword>
                      
                      <Btn btnType={BtnType.splitIcon} caption="REGISTER" contentAlignment={ContentAlignment.center}/>

                    </form>

                </div>

                <div className="popup__options-v">

                  <Link href="/Login" className="popup__options-btn">I have an account</Link>

                </div>


      </Popup>

  );

}
