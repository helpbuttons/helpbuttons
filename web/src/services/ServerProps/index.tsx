import { makeImageUrl } from 'shared/sys.helper';

export class ServerPropsService {
  public static async general(subtitle, ctx) {
    const baseURL = process.env.API_URL;
    const configURL = `${baseURL}/networks/config`;
    const networkConfigURL = `${baseURL}/networks/findById`;

    let configData = {hostName: 'error',};
    try {
      const configRes = await fetch(configURL, {
        next: { revalidate: 30 },
      });  
      configData = await configRes.json();
    } catch (error) {
      console.log(error);
      throw new Error('getting config ' + configURL)
    }

    let networkConfigData = {name: 'error',  description: 'error', logo: 'error' };
    try {
      const networkConfigRes = await fetch(networkConfigURL, {
        next: { revalidate: 30 },
      });
      networkConfigData = await networkConfigRes.json();
    } catch (error) {
      console.log(error);
      throw new Error('getting network configuration ')
    }
    if (networkConfigData?.statusCode && networkConfigData?.statusCode == 404)
    {
      throw new Error('getting network configuration ')
    }
    
    let hostname;
    try {
      ({ hostname } = new URL(configData.hostName));
    } catch (error) {
      console.log(error)
      throw new Error('getting hostname from config hostname ' + JSON.stringify(configData))
    }
    
    return {
      metadata: getMetadata(subtitle, networkConfigData, configData.hostName, ctx.resolvedUrl),
      selectedNetwork: networkConfigData,
      config: { ...configData, hostname },
    };
  }
}


export function getMetadata(subtitle, selectedNetwork, baseUrl, uri)
{
  const title = subtitle
      ? `${selectedNetwork.name} - ${subtitle}`
      : selectedNetwork.name;
  return {
  title: title,
    description: selectedNetwork.description,
    image: `${makeImageUrl(
      selectedNetwork.logo,
      baseUrl + '/api',
    )}`,
    siteTitle: selectedNetwork.name,
    pageurl: `${baseUrl}${uri}`,
  };
}