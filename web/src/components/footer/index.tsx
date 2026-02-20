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
            <span className="footer__link--item">
              {selectedNetwork.name}
            </span>
          </li>
        }
        <li className="footer__link">
          <a href="/Faqs"  className="footer__link--item">
            {t('footer.whatIsNetwork')}
          </a>
        </li>
        <li className="footer__link">
          <a href="/ButtonNew" className="footer__link--item">
           {t('footer.create')}
          </a>
        </li>
        <li className="footer__link">
          <a href="/Explore" className="footer__link--item">
            {t('footer.explore')}
          </a>
        </li>
        <li className="footer__link">
          <a href="/Faqs?chapter=privacyPolicy" className="footer__link--item">
            {t('footer.privacyPolicy')}
          </a>
        </li>
      </ul>
      <ul className="footer__actions">
        {/* <li className="footer__link-header">
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
        </li> */}
      </ul>
      <ul className="footer__contact">
        <li className="footer__link-header">
          <span className="footer__link--item">
            Helpbuttons
          </span>
        </li>
        <li className="footer__link">
          <a href="https://helpbuttons.org" className="footer__link--item">
            {t('footer.whatsHelpbuttons')}
          </a>
        </li>
        <li className="footer__link">
          <a href="https://buy.stripe.com/8x23cv73DfFhb7r3Yb7g40K" target="_blank" className="footer__link--item">
            {t('footer.investDonations')}
          </a>
        </li>
        <li className="footer__link">
          <a href="https://helpbuttons.org/#section3" target="_blank" className="footer__link--item">
            {t('footer.otherNetworks')}
          </a>
        </li>
        <li className="footer__link">
          <a href="https://github.com/helpbuttons/helpbuttons" target="_blank" className="footer__link--item">
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
