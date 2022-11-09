//Form component with the main fields for signup in the platform
//imported from libraries
//imported react components
import Popup from 'components/popup/Popup';

//imported internal classes, variables, files or functions
import PopupSection from 'components/popup/PopupSection';
import LoginForm from 'components/user/LoginForm';
export default Login;

function Login() {
    return (
        <Popup title="Login" linkFwd="/HomeInfo">
           <LoginForm/>
        </Popup>
    );
}
