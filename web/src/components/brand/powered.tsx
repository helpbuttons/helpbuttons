import t from 'i18n';

export function PoweredBy() {
  return (
    <>
      {t('homeinfo.powered')}{' '}
      <a href="https://helpbuttons.org">helpbuttons</a>
    </>
  );
}

export function License() {
  return (
    <a href="https://github.com/helpbuttons/helpbuttons/blob/main/LICENSE">
      GNU Affero General Public License v3.0
    </a>
  );
}
