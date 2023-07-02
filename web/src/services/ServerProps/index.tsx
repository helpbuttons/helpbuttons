import { makeImageUrl } from 'shared/sys.helper';

export class ServerPropsService {
  public static async general(subtitle, ctx) {
    const baseURL = process.env.API_URL;
    const configURL = `${baseURL}networks/config`;
    const networkConfigURL = `${baseURL}networks/findById`;

    const configRes = await fetch(configURL, {
      next: { revalidate: 30 },
    });
    const networkConfigRes = await fetch(networkConfigURL, {
      next: { revalidate: 30 },
    });

    const configData = await configRes.json();
    const networkConfigData = await networkConfigRes.json();
    const title = subtitle
      ? `${networkConfigData.name} - ${subtitle}`
      : networkConfigData.name;

    const {hostname, pathname} = new URL(configData.hostName)
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
      config: {...configData, hostname},
      
    };
  }
}
