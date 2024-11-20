import t from 'i18n';
import { GlobalState } from 'pages';
import { useGlobalStore } from 'store/Store';

export function PoweredBy({showVersion = false}) {
  const metadata = useGlobalStore(
    (state: GlobalState) => state.metadata,
  );

  return (
    <>
      {t('homeinfo.powered')}{' '}
      <a href="https://helpbuttons.org">helpbuttons {showVersion && metadata.version}</a>
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
