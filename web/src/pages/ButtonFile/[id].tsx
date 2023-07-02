import CardButton from 'components/button/CardButton';
import Feed from 'layouts/Feed';
import {  NextPageContext } from 'next';
import SEO from 'components/seo';
import { ServerPropsService } from 'services/ServerProps';
import { setConfig } from 'state/Setup';
import { store } from 'pages';
import NavBottom from 'components/nav/NavBottom';
import { Button } from 'shared/entities/button.entity';
import { makeImageUrl } from 'shared/sys.helper';

export default function ButtonFile({metadata, config, currentButton}) {

  store.emit(new setConfig(config));

  return (
    <>
    <SEO {...metadata}/>
      <div className="body__content">
        <div className="body__section">
          <CardButton button={currentButton} />
          <Feed button={currentButton}/>
        </div>
      </div>
      <NavBottom/>
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const serverProps = await ServerPropsService.general(
    'New Button',
    ctx,
  );
  const buttonUrl = `${process.env.API_URL}buttons/findById/${ctx.params.id}`;
  
  const currentButtonFetch = await fetch(buttonUrl, { next: { revalidate: 10 } });
  const currentButtonData :Button = await currentButtonFetch.json()
  const serverPropsModified = {...serverProps, metadata:{...serverProps.metadata, title: currentButtonData.title, description: currentButtonData.description, image: 
    `${makeImageUrl(
      currentButtonData.image,
      serverProps.config.hostName + '/api',
    )}`}}

    return { props: {...serverPropsModified, currentButton: await currentButtonData} };
};