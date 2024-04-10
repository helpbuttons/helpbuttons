import t from 'i18n';
import Link from 'next/link';

export default function LoginOrSignup() {
  return (
    <div className="message message--others">
      {t('feed.please')}{' '}
      <Link href="/Login"> {t('feed.loginMessage')}</Link>{' '}
      {t('feed.or')} <Link href="/Signup"> {t('feed.signUp')}</Link>{' '}
      {t('feed.beforeComment')}
    </div>
  );
}
