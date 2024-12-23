import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import t from 'i18n';
import { useEffect, useState } from 'react';
import { IoDownload } from 'react-icons/io5';

interface IBeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function useAddToHomescreenPrompt(): [
  IBeforeInstallPromptEvent | null,
  () => void,
] {
  const [prompt, setState] = useState<IBeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(true);

  const checkNetworkName = async () => {
    try {
      console.log('Checking network name...');
      const manifestResponse = await fetch('/manifest.json');
      if (!manifestResponse.ok) {
        console.error('Failed to fetch manifest.json', manifestResponse.status);
        return true; // Allow install on error
      }
  
      const currentManifest = await manifestResponse.json();
      console.log('Current manifest:', currentManifest);
  
      if ('getInstalledRelatedApps' in navigator) {
        // @ts-ignore
        const installedApps = await navigator.getInstalledRelatedApps();
        console.log('Installed apps:', installedApps);
  
        const installedApp = installedApps.find(app => {
          return (
            app.url.includes(window.location.hostname) &&
            app.name !== currentManifest.name
          );
        });
  
        return !installedApp || installedApp.name !== currentManifest.name;
      }
  
      console.log('getInstalledRelatedApps not supported');
      return true; // Allow install if we can't check
    } catch (error) {
      console.error('Error checking network name:', error);
      return true; // Allow install on error
    }
  };

  const promptToInstall = async () => {
    if (prompt) {
      const allowInstall = await checkNetworkName();
      if (allowInstall) {
        return prompt.prompt();
      } else {
        return Promise.reject(
          new Error('An instance of this app is already installed')
        );
      }
    }
    return Promise.reject(
      new Error(
        'Tried installing before browser sent "beforeinstallprompt" event'
      )
    );
  };

  useEffect(() => {
    const ready = async (e: IBeforeInstallPromptEvent) => {
      console.log('beforeinstallprompt event captured');
      e.preventDefault();
  
      const allowInstall = await checkNetworkName();
      console.log('Allow install:', allowInstall);
  
      if (allowInstall) {
        setState(e);
        setCanInstall(true);
        console.log('Prompt set and canInstall is true');
      } else {
        setCanInstall(false);
        console.log('Install not allowed');
      }
    };
  
    window.addEventListener('beforeinstallprompt', ready as any);
  
    return () => {
      window.removeEventListener('beforeinstallprompt', ready as any);
    };
  }, []);

  return [canInstall ? prompt : null, promptToInstall];
}

export function InstallButton() {
  console.log('InstallButton rendered'); // Check if this logs

  const [prompt, promptToInstall] = useAddToHomescreenPrompt();
  const [installError, setInstallError] = useState<string | null>(null);

  const handleInstall = async () => {
    try {
      await promptToInstall();
      setInstallError(null);
    } catch (error) {
      setInstallError(error.message);
    }
  };

  return (
    <>
      {prompt ? (
        <>
          <Btn
            btnType={BtnType.corporative}
            iconLink={<IoDownload />}
            caption={t('homeinfo.installButton')}
            iconLeft={IconType.circle}
            contentAlignment={ContentAlignment.center}
            onClick={handleInstall}
          />
          {installError && <div className="error-message">{installError}</div>}
        </>
      ) : (
        <div>No installation prompt available</div>
      )}
    </>
  );
}