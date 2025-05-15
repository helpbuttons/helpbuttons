import { GlobalState, store } from "state";
import { useEffect, useState } from "react";
import { FindButton, updateCurrentButton } from "state/Explore";
import { MainPopupPage, SetMainPopup, SetMainPopupCurrentButton } from "state/HomeInfo";
import { useGlobalStore } from 'state';
import { alertService } from "services/Alert";
import { useSearchParams } from "next/navigation";

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

  const mainPopupButton = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupButton)
  const searchParams = useSearchParams()
  const buttonId = searchParams.get('btn')

  useEffect(() => {
    if (['Explore', 'ButtonEdit'].indexOf(pageName) < 0) {
      if (mainPopupButton) {
        updateUrl(router, { btn: mainPopupButton.id, ...router.query })
      } else {
        const { btn, ...restParams } = router.query;
        updateUrl(router, restParams)
      }
    }
  }, [mainPopupButton, pageName])

  useEffect(() => {
    if (['Explore', 'ButtonEdit'].indexOf(pageName) < 0) {
    if (!mainPopupButton && buttonId) {
      store.emit(new FindButton(buttonId, (button) => {
        
          store.emit(new SetMainPopupCurrentButton(button));
        
      }, () => alertService.error('button not found')))
    }else if(mainPopupButton && !buttonId)
    {
        store.emit(new SetMainPopupCurrentButton(null));
      
    }
  }
  }, [buttonId])

}

export function useParamsMainPopup(router) {
  const searchParams = useSearchParams()
  const v = searchParams.get('v')

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
      store.emit(new SetMainPopup(v as MainPopupPage))
    }else if(mainPopupPage && !v)
    {
      store.emit(new SetMainPopup(MainPopupPage.HIDE))
    }
  }, [v])
}