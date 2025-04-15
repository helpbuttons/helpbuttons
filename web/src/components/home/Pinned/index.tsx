import CardButtonList, { ButtonLinkType } from "components/list/CardButtonList";
import t from "i18n";
import { useEffect } from "react";
import { useButtonTypes } from "shared/buttonTypes";
import { GlobalState, store, useGlobalStore } from "state";
import { FindPinnedButtons } from "state/Button";

export default function HomeInfoPinnedButtons({ }) {

    const pinnedButtons = useGlobalStore((state: GlobalState) => state.explore.map.pinnedButtons);
    const buttonTypes = useButtonTypes();

    useEffect(() => {
        if (!pinnedButtons) {
            store.emit(new FindPinnedButtons())
        }
    }, [])
    return (<>
        {/*  PINNED BUTTONS */}
        {(pinnedButtons && pinnedButtons.length > 0) &&
            <div className="homeinfo-card">
                <div className="homeinfo-card__header">
                    <h3 className="homeinfo-card__header-title">
                        {t('homeinfo.featured')}
                    </h3>
                </div>
                <hr></hr>

                <div className="homeinfo-card__section">

                    <div className="homeinfo__section--featured">
                        {pinnedButtons.map((btn, i) => (
                            <CardButtonList
                                button={btn}
                                key={i}
                                buttonTypes={buttonTypes}
                                showMap={false}
                                linkType={ButtonLinkType.MAINPOPUP}
                            />


                        ))}
                    </div>
                </div>
            </div>
        }</>
    )
}
