import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import t from 'i18n';
import { useEffect, useState } from 'react';
import { IoDownload } from 'react-icons/io5';

export function InstallButton({isInstallable, promptToInstall}) {
  if (!isInstallable) {
    return null;
  }
  return (
    <Btn
        btnType={BtnType.filterCorp}
        iconLink={<IoDownload />}
        caption={t('homeinfo.installButton')}
        iconLeft={IconType.circle}
        contentAlignment={ContentAlignment.center}
        onClick={promptToInstall}
      />
  );
}

interface IBeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPrompt(): [
  IBeforeInstallPromptEvent | null,
  () => void,
] {
  const [prompt, setState] =
    useState<IBeforeInstallPromptEvent | null>(null);

  const promptToInstall = () => {
    if (prompt) {
      return prompt.prompt();
    }
    return Promise.reject(
      new Error(
        'Tried installing before browser sent "beforeinstallprompt" event',
      ),
    );
  };

  useEffect(() => {
    const ready = (e: IBeforeInstallPromptEvent) => {
      e.preventDefault();
      setState(e);
    };

    window.addEventListener('beforeinstallprompt', ready as any);

    return () => {
      window.removeEventListener('beforeinstallprompt', ready as any);
    };
  }, []);

  return [prompt, promptToInstall];
}
