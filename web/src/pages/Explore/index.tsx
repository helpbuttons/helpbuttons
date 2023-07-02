
import SEO from 'components/seo';
import HoneyComb from './HoneyComb';
import NavBottom from 'components/nav/NavBottom';
import { NextPageContext } from 'next';
import { store } from 'pages';
import { ServerPropsService } from 'services/ServerProps';
import { setNetwork } from 'state/Networks';

export default function Explore({metadata, selectedNetwork, config}) {
  const browseType = selectedNetwork.exploreSettings.browseType;
  // temporary hack to avoid deep refactor
  store.emit(new setNetwork(selectedNetwork));
  
  return (
    <>
      <SEO {...metadata}/>
      <HoneyComb />
      <NavBottom />
    </>
  );
}

export const getStaticProps = async (ctx: NextPageContext) => {
  const serverProps = await ServerPropsService.general('Explore', ctx)
  return {props: serverProps}
}
