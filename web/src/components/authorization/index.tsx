import t from 'i18n';
import Link from 'next/link';
import router from 'next/router';
import { getReturnUrl } from 'shared/sys.helper';

export default function LoginOrSignup() {
  return (
    <div className="message message--others">
      {t('feed.please')}{' '}
      <Link
        href="#"
        onClick={() => {
          router.push({
            pathname: '/Login',
            query: { returnUrl: getReturnUrl() },
          });
        }}
      >
        {' '}
        {t('feed.loginMessage')}
      </Link>{' '}
      {t('feed.or')} <Link href="#"
        onClick={() => {
          router.push({
            pathname: '/Signup',
            query: { returnUrl: getReturnUrl() },
          });
        }}> {t('feed.signUp')}</Link>{' '}
      {t('feed.beforeComment')}
    </div>
  );
}
