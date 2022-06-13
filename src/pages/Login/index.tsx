//Form component with the main fields for signup in the platform
//imported from libraries
//imported react components
import ImageWrapper, { ImageType } from 'elements/ImageWrapper'
import Popup from 'components/popup/Popup';
import { Link } from 'elements/Link';

//imported internal classes, variables, files or functions
import PopupImg from 'components/popup/PopupImg';
import PopupSection from 'components/popup/PopupSection';
import PopupOptions from 'components/popup/PopupOptions';
import LoginForm from 'components/user/LoginForm';
export default Login;

function Login() {
      return (
          <Popup title="Login" linkFwd="/HomeInfo">

          <PopupImg>
            <ImageWrapper imageType={ImageType.popup} src="https://dummyimage.com/200/#ccc/fff" alt="popup_img"/>
          </PopupImg>
          <PopupSection>
            <LoginForm>
              
            </LoginForm>
          </PopupSection>

          <PopupOptions>

            <Link href="/Signup" className="popup__options-btn">I don&apos;t have an account</Link>

          </PopupOptions>

          </Popup>
      );
}
