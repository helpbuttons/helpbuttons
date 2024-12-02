import t from 'i18n';
import { GlobalState } from 'state';
import { useGlobalStore } from 'state';

export function PoweredBy() {
  return (
    <>
      {t('homeinfo.powered')}{' '}
      <a href="https://helpbuttons.org">helpbuttons</a>
    </>
  );
}
export function PoweredExtra() {
  const metadata = useGlobalStore(
    (state: GlobalState) => state.metadata,
  );

  return (
    <>
      <PoweredBy/>
      <a href={`https://github.com/helpbuttons/helpbuttons/releases/tag/${metadata.version}`}>{metadata.version}</a> - 
      <a href="/Faqs">{t('menu.faqs')}</a> -
      {/* <a href={`/Contact`}>Contact</a> - 
      <a href="https://helpbuttons.org/help">Help</a> - */}
      <a href={`/api`}>API</a> - 
      <License/>
    </>
  );
}

function License() {
  return (
    <a href="https://github.com/helpbuttons/helpbuttons/blob/main/LICENSE">
      GNU Affero General Public License v3.0
    </a>
  );
}
