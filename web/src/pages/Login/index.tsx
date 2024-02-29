//Form component with the main fields for signup in the platform
//imported from libraries
//imported react components
import Popup from 'components/popup/Popup';

//imported internal classes, variables, files or functions
import PopupSection from 'components/popup/PopupSection';
import LoginForm from 'components/user/LoginForm';
import t from 'i18n';
import router from 'next/router';
export default Login;

function Login() {
    return (
        <Popup title={t("user.login")} linkBack={() => router.back()}>
           <LoginForm/>
        </Popup>
    );
}
