import Popup from 'components/popup/Popup';
import LoginForm from 'components/user/LoginForm';
import t from 'i18n';
import { NextPageContext } from 'next';
import router from 'next/router';
import { ServerPropsService, setMetadata } from 'services/ServerProps';
import { setSSRLocale } from 'shared/sys.helper';
export default Login;

function Login() {
    return (
        <Popup title={t("user.login")} linkBack={() => router.back()}>
           <LoginForm/>
        </Popup>
    );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
    setSSRLocale(ctx.locale);
    return setMetadata(t('menu.login'), ctx)
  };