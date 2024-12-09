import LoginForm from 'components/user/LoginForm';
import t from 'i18n';
import { NextPageContext } from 'next';
import {  setMetadata } from 'services/ServerProps';
import { setLocale } from 'shared/sys.helper';
import { useMetadataTitle } from 'state/Metadata';
export default Login;

function Login() {
    useMetadataTitle(t('menu.login'))

    return (

            <LoginForm/>
    );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
    return setMetadata(t('menu.login'), ctx)
  };