import { makeImageUrl } from 'shared/sys.helper';

export class ServerPropsService {
  public static async general(subtitle, ctx) {
    const baseURL = process.env.API_URL;
    console.log('getting metadata from: ')
    console.log(baseURL)
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
      throw new Error('getting network configuration ' + networkConfigURL)
    }
    const title = subtitle
      ? `${networkConfigData.name} - ${subtitle}`
      : networkConfigData.name;
    let hostname;

    try {
      ({ hostname } = new URL(configData.hostName));
    } catch (error) {
      console.log(error)
      throw new Error('getting hostname from config hostname ' + JSON.stringify(configData))
    }

    return {
      metadata: {
        title: title,
        description: networkConfigData.description,
        image: `${makeImageUrl(
          networkConfigData.logo,
          configData.hostName + '/api',
        )}`,
        siteTitle: networkConfigData.name,
        pageurl: `${configData.hostName}${ctx.resolvedUrl}`,
      },
      selectedNetwork: networkConfigData,
      config: { ...configData, hostname },
    };
  }
}
