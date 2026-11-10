import t from "i18n";
import { NextPageContext } from "next";
import ExploreButtonId from "pages/Explore/b/[buttonId]";
import { setMetadata } from "pages/_serverprops";
import { getServerSidePropsHandler, shouldEnableSSR } from 'shared/staticapp.utils';

export default function Show({
  metadata
}) {
  return <ExploreButtonId metadata={metadata}/>
}

export const getServerSideProps = shouldEnableSSR
  ? (ctx) => getServerSidePropsHandler(t('menu.explore'), ctx)
  : undefined;