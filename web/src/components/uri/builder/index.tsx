import { GlobalState, store } from "state";
import { useEffect, useState } from "react";
import { FindButton } from "state/Explore";
import { MainPopupPage, SetMainPopup, SetMainPopupCurrentButton } from "state/HomeInfo";
import { useGlobalStore } from 'state';
import { alertService } from "services/Alert";

export function updateUrl(router, queryParams = null) {
  if (queryParams === null) {
    router.push(
      {
      },
      undefined,
      { shallow: true }
    );
  } else {
    router.push(
      {
        query: queryParams,
      },
      undefined,
      { shallow: true }
    );
  }

}


export function useParamsBtn(router, pageName) {
  const [btnParam, setBtnParam] = useState(router.query.btn || '');
  const mainPopupButton = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupButton)
  
  useEffect(() => {
    if (mainPopupButton) {
      updateUrl(router, { btn: mainPopupButton.id, ...router.query })
    } else{
      const { btn, ...restParams } = router.query;
      updateUrl(router, restParams)
    }
  }, [mainPopupButton, pageName])

  useEffect(() => {
    if (!mainPopupButton && btnParam) {
      store.emit(new FindButton(btnParam, (button) => {
        store.emit(new SetMainPopupCurrentButton(button));
        if(['Explore'].indexOf(pageName) < 0)
        {
          store.emit(new SetMainPopup(MainPopupPage.BUTTON))
        }
        
      }, () => alertService.error('button not found')))
    }
  }, [btnParam])

}

export function useParamsMainPopup(router) {
  const [v, setV] = useState(router.query.v || '');

  const mainPopupPage: MainPopupPage = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupPage)
  useEffect(() => {
    if (mainPopupPage && MainPopupPage.HIDE != mainPopupPage) {
      updateUrl(router, { v: mainPopupPage, ...router.query })
    } else {
      const { v, ...restParams } = router.query;
      updateUrl(router, restParams)
    }
  }, [mainPopupPage])

  useEffect(() => {
    if (v && mainPopupPage != v) {
      store.emit(new SetMainPopup(v))
    }
  }, [v])
}