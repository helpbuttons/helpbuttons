import { makeImageUrl, setSSRLocale } from 'shared/sys.helper';

export class ServerPropsService {
  public static async general(subtitle, ctx) {
    setSSRLocale(ctx.locale);
    const baseURL = process.env.API_URL;
    const configURL = `${baseURL}/networks/config`;
    const networkConfigURL = `${baseURL}/networks/findById`;

    const catchMetadata = {
      metadata: {
        title: '_',
        description: ' made with Helpbuttons.org',
        image: '',
        siteTitle: '_',
        pageurl: `${ctx.uri}`,
      },
      selectedNetwork: {
        backgroundColor: '#FFDD02',
        textColor: 'black',
        nomeclature: 'helpbutton',
        nomeclaturePlural: 'helpbuttons',
        config: {},
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
      console.log(errorMsg);
      // throw new Error(errorMsg);
      return catchMetadata
    }

    let networkConfigData = {
      name: 'error',
      description: 'error',
      logo: 'error',
    };
    try {
      const networkConfigRes = await fetch(networkConfigURL, {
        next: { revalidate: 30 },
      });
      networkConfigData = await networkConfigRes.json();
    } catch (error) {
      const errorMsg = 'error getting network configuration';
      console.log(errorMsg);
      return catchMetadata
      // throw new Error(errorMsg);
    }
    if (
      networkConfigData?.statusCode &&
      networkConfigData?.statusCode == 404
    ) {
      const errorMsg = 'error getting network configuration 2';
      console.log(errorMsg);
      return catchMetadata
      // throw new Error(errorMsg);
    }

    let hostname;
    try {
      ({ hostname } = new URL(configData.hostName));
    } catch (error) {
      const errorMsg =
        'error getting hostname from config hostname ' +
        JSON.stringify(configData);
      console.log(errorMsg);
      return catchMetadata
      // throw new Error(errorMsg);
    }

    return {
      metadata: getMetadata(
        subtitle,
        networkConfigData,
        configData.hostName,
        ctx.resolvedUrl,
      ),
      selectedNetwork: networkConfigData,
      config: { ...configData, hostname },
    };
  }
}

export function getMetadata(subtitle, selectedNetwork, baseUrl, uri) {
  const title = subtitle
    ? `${selectedNetwork.name} - ${subtitle}`
    : selectedNetwork.name;
  const imageUrl = makeImageUrl(
    selectedNetwork.logo,
    baseUrl + '/api',
  );
  return {
    title: title,
    description:
      selectedNetwork.description + ' made with Helpbuttons.org',
    image: imageUrl,
    siteTitle: selectedNetwork.name,
    pageurl: `${baseUrl}${uri}`,
  };
}
