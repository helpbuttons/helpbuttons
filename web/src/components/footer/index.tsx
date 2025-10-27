import { PoweredExtra } from "components/brand/powered";
import BrandCard from "components/map/Map/BrandCard";
import { ShowDesktopOnly, ShowMobileOnly } from "elements/SizeOnly";
import t from "i18n";
import { GlobalState, store, useStore } from "state";

export default function Footer() {

  const selectedNetwork = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
    false,
  );

  return (<>
    <div className="footer__wrapper">
      <div className="footer__title">
        <ShowMobileOnly>
          <BrandCard/>
        </ShowMobileOnly>
      </div>
      <div className="footer__main">

      <ul className="footer__links">
        {selectedNetwork && 
          <li className="footer__link-header">
            <a href="/" className="footer__link--item">
              {selectedNetwork.name}
            </a>
          </li>
        }
        <li className="footer__link">
          <a href="/Faqs" className="footer__link--item">
            {t('footer.whatIsNetwork')}
          </a>
        </li>
        <li className="footer__link">
          <a href="/buttonnew" className="footer__link--item">
           {t('footer.create')}
          </a>
        </li>
        <li className="footer__link">
          <a href="/explore" className="footer__link--item">
            {t('footer.explore')}
          </a>
        </li>
        <li className="footer__link">
          <a href="/privacy-policy" className="footer__link--item">
            {t('footer.privacyPolicy')}
          </a>
        </li>
      </ul>
      <ul className="footer__actions">
        <li className="footer__link-header">
          <a href="/" className="footer__link--item">
            {t('footer.assistance')}
          </a>
        </li>
        <li className="footer__link">
          <a href="/admins" className="footer__link--item">
            {t('footer.adminSupport')}
          </a>
        </li>
        <li className="footer__link">
          <a href="/admins" className="footer__link--item">
            {t('footer.securitySupport')}
       
          </a>
        </li>
        <li className="footer__link">
          <a href="/admins" className="footer__link--item">
            {t('footer.sendAProblem')}
          </a>
        </li>

      </ul>
      <ul className="footer__contact">
        <li className="footer__link-header">
          <a href="/" className="footer__link--item">
            Helpbuttons
          </a>
        </li>
        <li className="footer__link">
          <a href="www.helpbuttons.org" className="footer__link--item">
            {t('footer.whatsHelpbuttons')}
          </a>
        </li>
        <li className="footer__link">
          <a href="www.helpbuttons.org/donate" className="footer__link--item">
            {t('footer.investDonations')}
          </a>
        </li>
        <li className="footer__link">
          <a href="www.helpbuttons.org/networks" className="footer__link--item">
            {t('footer.otherNetworks')}
          </a>
        </li>
        <li className="footer__link">
          <a href="github.com/helpbuttons/helpbuttons" className="footer__link--item">
            {t('footer.developers')}
          </a>
        </li>
      </ul>
      </div>
      <div className="footer__bottom">
        <span className="footer__section--attr">
          <PoweredExtra />
        </span>     
      </div>

    </div>
  </>)
}
