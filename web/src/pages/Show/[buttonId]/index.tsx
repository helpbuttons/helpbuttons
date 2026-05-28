import t from "i18n";
import { NextPageContext } from "next";
import ExploreButtonId from "pages/Explore/b/[buttonId]";
import { setMetadata } from "services/ServerProps";

export default function Show({
  metadata
}) {
  return <ExploreButtonId metadata={metadata}/>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('menu.explore'), ctx);
};