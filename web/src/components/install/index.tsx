import { DesktopNotificationsButton } from 'components/notifications';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import t from 'i18n';
import router from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { IoDownload, IoDownloadOutline } from 'react-icons/io5';
import { GlobalState, useGlobalStore } from 'state';


export function HomeInfoInstallCard({ selectedNetwork }) {

  const [isInstalled, setIsInstalled] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      registerServiceWorker()
    }
  }, [])

  const registerServiceWorker = useCallback(async () => {
    try {
      await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })

    } catch (err) {
      console.error('Error registering service worker:', err)
    }
  }, [])
  const sessionUser = useGlobalStore(
    (state: GlobalState) => state.sessionUser,
  );
  const notificationsPermissionGranted = useGlobalStore(
    (state: GlobalState) =>
      state.activities.notificationsPermissionGranted,
  );
  if(isInstalled && notificationsPermissionGranted){
    return <></>
  }
  return (    
    <div className="homeinfo-card homeinfo-card--wrap">
      <div className="homeinfo-card__header">
        <h3 className="homeinfo-card__header-title">
          <IoDownloadOutline />
          {t('homeinfo.install', [
            selectedNetwork?.name,
          ])}
        </h3>
        </div>
        <div className="homeinfo__description">
          <PWADebug/>
          {!isInstalled && <InstallButton setIsInstalled={setIsInstalled} isInstalled={isInstalled}/>}
          {sessionUser && <DesktopNotificationsButton allowedToNotify={notificationsPermissionGranted}/>}
        </div>
    </div>
  )
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallButton({setIsInstalled, isInstalled}) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  // const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isFirefox, setIsFirefox] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  useEffect(() => {
    // Detect platform
    const ua = window.navigator.userAgent
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream
    const isFFBrowser = /Firefox/.test(ua)

    setIsIOS(isIOSDevice)
    setIsFirefox(isFFBrowser)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Also check iOS standalone
    if ((navigator as any).standalone === true) {
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event (Chromium only)
    const handler = (e: Event) => {
      e.preventDefault() // Prevent the default mini-infobar
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])
  const alertHowToInstall = () => {
    alert(
      'To install this app:\n\n' +
      '1. Tap the menu (⋮) button\n' +
      '2. Tap "Install" or "Add to Home Screen"'
    )
  }
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alertHowToInstall()
      return
    }

    // Show the browser's install prompt
    await deferredPrompt.prompt()

    // Wait for user's choice
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    setDeferredPrompt(null)
  }

  // Already installed
  if (isInstalled) {
    return null // or return <p>App is installed! ✅</p>
  }

  // iOS - show manual instructions
  // if (isIOS) {
  //   return (
  //       <Btn
  //         btnType={BtnType.filterCorp}
  //         iconLink={<IoDownload />}
  //         caption={t('homeinfo.installButton')}
  //         iconLeft={IconType.circle}
  //         contentAlignment={ContentAlignment.center}
  //         onClick={handleInstallClick}
  //       />)
  // }

  // Firefox - show manual instructions
  if (isFirefox) {
    return (
      <div>
        <Btn
          btnType={BtnType.filterCorp}
          iconLink={<IoDownload />}
          caption={t('homeinfo.installButton')}
          iconLeft={IconType.circle}
          contentAlignment={ContentAlignment.center}
          onClick={alertHowToInstall}
        />
      </div>
    )
  }

  return (
    <Btn
    btnType={BtnType.filterCorp}
    iconLink={<IoDownload />}
    caption={t('homeinfo.installButton')}
    iconLeft={IconType.circle}
    contentAlignment={ContentAlignment.center}
    onClick={handleInstallClick}/>
  )
}

export function PWADebug() {

  const pwa = router.query.pwa as string;
  
  if(!pwa){
    return <></>
  }
  const [checks, setChecks] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function runChecks() {
      const results: Record<string, boolean> = {}

      // 1. HTTPS?
      results['HTTPS'] = location.protocol === 'https:' || location.hostname === 'localhost'

      // 2. Has manifest?
      results['Has manifest link'] = !!document.querySelector('link[rel="manifest"]')

      // 3. Manifest fetchable?
      try {
        const link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement
        if (link) {
          const res = await fetch(link.href)
          const manifest = await res.json()
          results['Manifest valid JSON'] = true
          results['Has name'] = !!(manifest.name || manifest.short_name)
          results['Has start_url'] = !!manifest.start_url
          results['Has display'] = ['standalone', 'fullscreen', 'minimal-ui'].includes(manifest.display)
          results['Has 192px icon'] = manifest.icons?.some(
            (i: any) => i.sizes?.includes('192x192')
          )
          results['Has 512px icon'] = manifest.icons?.some(
            (i: any) => i.sizes?.includes('512x512')
          )
        }
      } catch {
        results['Manifest valid JSON'] = false
      }

      // 4. Service worker?
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations()
        results['Service Worker registered'] = regs.length > 0
      }

      // 5. Not already installed?
      results['Not already installed'] = !window.matchMedia('(display-mode: standalone)').matches

      setChecks(results)
    }

    runChecks()
  }, [])

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h3>PWA Install Readiness</h3>
      {Object.entries(checks).map(([key, value]) => (
        <div key={key}>
          {value ? '✅' : '❌'} {key}
        </div>
      ))}
    </div>
  )
}