import Loading from "components/loading";
import t from "i18n";
import { ButtonNewForm } from "pages/ButtonNew";
import { useMetadataTitle } from "state/Metadata";
import { useSelectedNetwork } from "state/Networks";

export default function ButtonNew({ metadata }) {
    const selectedNetwork = useSelectedNetwork()
  
    useMetadataTitle(t('menu.create'))
  
    return (
      <>
      {selectedNetwork?.exploreSettings?.center ? 
        <ButtonNewForm selectedNetwork={selectedNetwork} />
       : <Loading/>
      }
      </>
    );
  }