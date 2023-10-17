import { NextPageContext } from 'next';
import HoneyComb from './HoneyComb';
import { ServerPropsService } from 'services/ServerProps';
import { ClienteSideRendering } from 'pages/_client';
import SEO from 'components/seo';

export default function Explore({
  metadata,
  selectedNetwork,
  config,
}) {
  return (
    <>
      <SEO {...metadata} />
      <ClienteSideRendering>
        <HoneyComb selectedNetwork={selectedNetwork} />
      </ClienteSideRendering>
    </>
  );
}

// CAN'T GET BUTTON ID...
/*
export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    // const router = useRouter();
    // const hash = router.asPath.split('#')[1] || '';
    // console.log(hash)
    console.log(ctx)
    // const session = await getServerSession(
    const serverProps = await ServerPropsService.general('Home', ctx);
    return { props: serverProps };
  } catch (err) {
    console.log(err);
    return {
      props: {
        metadata: null,
        selectedNetwork: null,
        config: null,
        noconfig: true,
      },
    };
  }
};
/*
export const getServerSideProps = async (ctx: NextPageContext) => {
  const serverProps = await ServerPropsService.general(
    'Explore',
    ctx,
  );
  console.log(ctx.req.url)
  console.log(ctx.resolvedUrl)
  const btnId = ctx.params.btn;
  if (btnId) {
    const buttonUrl = `${process.env.API_URL}/buttons/findById/${btnId}`;
    const currentButtonFetch = await fetch(buttonUrl, {
      next: { revalidate: 10 },
    });
    const currentButtonData: Button = await currentButtonFetch.json();
    if (currentButtonData?.statusCode == HttpStatus.NOT_FOUND) {
      return { props: serverProps };
    }
    const serverPropsModified = {
      ...serverProps,
      metadata: {
        ...serverProps.metadata,
        title: currentButtonData.title,
        description: currentButtonData.description,
        image: `${makeImageUrl(
          currentButtonData.image,
          serverProps.config.hostName + '/api',
        )}`,
      },
    };
    return {
      props: {
        ...serverPropsModified,
        currentButton: await currentButtonData,
      },
    };
  }
  return { props: serverProps };
};
*/