import Popup from 'components/popup/Popup';
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
