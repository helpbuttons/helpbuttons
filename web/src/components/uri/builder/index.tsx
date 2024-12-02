import { NextRouter } from "next/router";
import { GlobalState, store } from "state";
import { useEffect } from "react";
import { FindButton, updateCurrentButton } from "state/Explore";
import { MainPopupPage, SetMainPopup } from "state/HomeInfo";
import { useGlobalStore } from 'state';

export const useRebuildUrl = (router: NextRouter) => {
    const currentButton = useGlobalStore((state: GlobalState) => state.explore.currentButton)
    const popupPage: MainPopupPage = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupPage)
    useEffect(() => {
        if (window && currentButton) {
            window.history.replaceState(null, '', `/Explore?btn=${currentButton.id}`);
        }
    }, [currentButton]);
    useEffect(() => {
        const btnId = giveParam('btn');
        const url = new URL(window.location.href);

        if (btnId) {
            store.emit(
                new FindButton(btnId, (buttonFetched) => {
                    store.emit(new updateCurrentButton(buttonFetched));
                }),
            );
        }
    }, [router])

    useEffect(() => {
        if (window) {
            if (popupPage != MainPopupPage.HIDE) {
                const newUrl = giveMeUrl([{ name: 'v', value: popupPage }])
                window.history.replaceState(null, '', newUrl);
            }
        }
    }, [popupPage])

    useEffect(() => {
        const _popupPage: MainPopupPage = giveParam('v') as MainPopupPage;
        if (_popupPage) {
            store.emit(
                new SetMainPopup(_popupPage)
            );
        }
    }, [router])

    const giveMeUrl = (_params) => {
        if (window) {
            const path = router.asPath.split('?')[0];
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            _params.map((_param) => {
                if (!_param.value) {
                    params.delete(_param.name)
                }

                params.set(_param.name, _param.value)
            })
            return `${path}/?${params.toString()}`;
        }
    }

    const giveParam = (param) => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        return params.get(param)
    }

};