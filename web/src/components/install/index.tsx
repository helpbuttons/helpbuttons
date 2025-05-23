import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import t from 'i18n';
import { useEffect, useState } from 'react';
import { IoDownload } from 'react-icons/io5';
import { store } from 'state';
import { SetIsInstallable } from 'state/HomeInfo';

export function InstallButton() {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt();
  useEffect(() => {
    if(prompt)
    {
      store.emit(new SetIsInstallable())
    }
  }, [prompt])
  return (
    <>
      {prompt && (
        <div>
          <Btn
              btnType={BtnType.filterCorp}
              iconLink={<IoDownload />}
              caption={t('homeinfo.installButton')}
              iconLeft={IconType.circle}
              contentAlignment={ContentAlignment.center}
              onClick={promptToInstall}
            />
        </div>
       )}
    </>
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

export function useAddToHomescreenPrompt(): [
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
