import { Button } from 'shared/entities/button.entity';
import { logError } from 'shared/log';
import { makeImageUrl, setLocale } from 'shared/sys.helper';
import { HttpStatus } from 'shared/types/http-status.enum';
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
      _selectedNetwork: null,
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
      logError(errorMsg, error);
      // throw new Error(errorMsg);
      return catchMetadata;
    }

    let networkConfigData = {
      name: 'error',
      description: 'error',
      logo: 'error',
      locale: 'en',
    };
    try {
      const networkConfigRes = await fetch(networkConfigURL, {
        next: { revalidate: 30 },
      });
      networkConfigData = await networkConfigRes.json();
    } catch (error) {
      const errorMsg = 'error getting network configuration';
      // console.log(errorMsg);
      logError(errorMsg, error);
      return {
        ...catchMetadata,
        error: { message: errorMsg, ...error },
      };
      // throw new Error(errorMsg);
    }
    if (
      networkConfigData?.statusCode &&
      networkConfigData?.statusCode == 404
    ) {
      const errorMsg = 'error getting network configuration 2';
      logError(errorMsg, networkConfigData);

      return {
        ...catchMetadata,
        error: {
          message: errorMsg,
          statusCode: networkConfigData?.statusCode,
        },
      };
    }
    setLocale(networkConfigData.locale);
    const version = require('../../../public/version.json').version
    let serverProps = {
      metadata: {...getMetadata(
        subtitle,
        networkConfigData,
        process.env.WEB_URL,
        ctx.resolvedUrl,
      ), version: version},
      _selectedNetwork: networkConfigData,
      _config: configData,
    };
    
    if (ctx.query?.btn) {
      const btnId = ctx.query.btn;
      const buttonUrl = `${process.env.API_URL}/buttons/findById/${btnId}`;
      const currentButtonFetch = await fetch(buttonUrl, {
        next: { revalidate: 10 },
      });
      const currentButtonData: Button =
        await currentButtonFetch.json();
      let currentButton = await currentButtonData;
      if (currentButtonData?.statusCode == HttpStatus.NOT_FOUND) {
        return serverProps;
      }

      return {
        ...serverProps,
        metadata: {
          ...serverProps.metadata,
          title: currentButtonData.title,
          description: currentButtonData.description,
          image: `${makeImageUrl(currentButtonData.image)}`,
        },
      };
    }

  if (ctx.query?.username) {
      const profileUrl = `${process.env.API_URL}/users/find/${ctx.params.username}`;
      const userProfileFetch = await fetch(profileUrl, {
        next: { revalidate: 10 },
      });
      const currentUserData = await userProfileFetch.json();

      if (currentUserData?.statusCode == HttpStatus.NOT_FOUND) {
        return { ...serverProps };
      }

      const k = {
        ...serverProps,
        metadata: {
          ...serverProps.metadata,
          title: `${serverProps._selectedNetwork.name} - ${currentUserData.username}`,
          description: currentUserData.description,
          image: `${makeImageUrl(
            currentUserData.avatar
          )}`,
        },
        userProfile: currentUserData,
      }
      return k
    }
    return serverProps;
  }
}

export function getMetadata(subtitle, selectedNetwork, webUrl, uri) {
  const title = subtitle
    ? `${selectedNetwork.name} - ${subtitle}`
    : selectedNetwork.name;
  const imageUrl = makeImageUrl(selectedNetwork.logo);
  return {
    title: title,
    description:
      selectedNetwork.description + ' made with Helpbuttons.org',
    image: `${webUrl}${imageUrl}`,
    siteTitle: selectedNetwork.name,
    pageurl: `${webUrl}${uri}`,
    color: selectedNetwork.backgroundColor,
    webUrl: webUrl,
  };
}

export async function setMetadata(subtitle, ctx) {
  setLocale(ctx.locale);
  const isServerReq = (req) => !req.url.startsWith('/_next');
  try {
    const serverProps = (isServerReq(ctx.req) || ctx.params?.username)
      ? await ServerPropsService.general(subtitle, ctx)
      : {
          props: {
            metadata: null,
            _selectedNetwork: null,
            config: null,
            noconfig: true,
          },
        };
    return { props: serverProps };
  } catch (err) {
    console.log(err)
    return {
      props: {
        metadata: null,
        _selectedNetwork: null,
        config: null,
        noconfig: true,
      },
    };
  }
}
