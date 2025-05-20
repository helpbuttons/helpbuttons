import Loading from "components/loading";
import t from "i18n";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { setMetadata } from "services/ServerProps";

export default function Explore({
  metadata
}) {

    const router = useRouter();
    useParams(router)
    
  return <Loading/>
}

function useParams(router)
{
  const { buttonId } = router.query;

  useEffect(() => {
    if(buttonId)
    {
      router.push(`/Explore/0/0/0/${buttonId}`, undefined, { shallow: true });
    }
  }, [buttonId])
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('menu.explore'), ctx);
};
