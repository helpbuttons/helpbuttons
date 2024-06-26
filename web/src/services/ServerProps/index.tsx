import { logError } from 'shared/log';
import { makeImageUrl, setSSRLocale } from 'shared/sys.helper';

export class ServerPropsService {
  public static async general(subtitle, ctx) {
    const baseURL = `${process.env.API_URL}/`;
    const configURL = `${baseURL}networks/config`;
    const networkConfigURL = `${baseURL}networks/findById`;

    const catchMetadata = {
      metadata: {
        title: '...',
        description: ' made with Helpbuttons.org',
        image: '',
        siteTitle: '...',
        pageurl: `${ctx.uri}`,
      },
      selectedNetwork: {
        backgroundColor: '#FFDD02',
        textColor: 'black',
        nomeclature: 'helpbutton',
        nomeclaturePlural: 'helpbuttons',
        config: {},
        locale: 'en'
      },
    };

    let configData = { hostName: 'error' };
    try {
      const configRes = await fetch(configURL, {
        next: { revalidate: 30 },
      });
      configData = await configRes.json();
    } catch (error) {
      const errorMsg = 'error getting config ' + configURL;
      // console.log(errorMsg);
      logError(errorMsg, error)
      // throw new Error(errorMsg);
      return catchMetadata
    }

    let networkConfigData = {
      name: 'error',
      description: 'error',
      logo: 'error',
      locale: 'en'
    };
    try {
      const networkConfigRes = await fetch(networkConfigURL, {
        next: { revalidate: 30 },
      });
      networkConfigData = await networkConfigRes.json();
    } catch (error) {
      const errorMsg = 'error getting network configuration';
      // console.log(errorMsg);
      logError(errorMsg, error)
      return catchMetadata
      // throw new Error(errorMsg);
    }
    if (
      networkConfigData?.statusCode &&
      networkConfigData?.statusCode == 404
    ) {
      const errorMsg = 'error getting network configuration 2';
      logError(errorMsg, networkConfigData)

      return catchMetadata
    }
    setSSRLocale(networkConfigData.locale);
    
    return {
      metadata: getMetadata(
        subtitle,
        networkConfigData,
        process.env.WEB_URL,
        ctx.resolvedUrl,
      ),
      selectedNetwork: networkConfigData,
      config: configData,
    };
  }
}

export function getMetadata(subtitle, selectedNetwork, webUrl, uri) {
  const title = subtitle
    ? `${selectedNetwork.name} - ${subtitle}`
    : selectedNetwork.name;
  const imageUrl = makeImageUrl(
    selectedNetwork.logo
  );
  return {
    title: title,
    description:
      selectedNetwork.description + ' made with Helpbuttons.org',
    image: `${webUrl}${imageUrl}`,
    siteTitle: selectedNetwork.name,
    pageurl: `${webUrl}${uri}`,
    color: selectedNetwork.backgroundColor,
    webUrl: webUrl
  };
}

export async function setMetadata(subtitle, ctx){
  try {
    const serverProps = await ServerPropsService.general(subtitle, ctx);
    return { props: serverProps };
  } catch (err) {
    return {
      props: {
        metadata: null,
        selectedNetwork: null,
        config: null,
        noconfig: true,
      },
    };
  }
}