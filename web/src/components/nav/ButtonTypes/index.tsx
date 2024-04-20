import Btn, { BtnType, IconType } from "elements/Btn";
import router from "next/router";
import { GlobalState, store } from "pages";
import { useEffect, useState } from "react";
import { buttonColorStyle, useButtonTypes } from "shared/buttonTypes";
import { Button } from "shared/entities/button.entity";
import { ClearCurrentButton, ResetFilters, ToggleAdvancedFilters, UpdateFiltersToFilterButtonType } from "state/Explore";
import { useStore } from "store/Store";

export function ListButtonTypes({ selectedNetwork, pageName }) {

    const showAdvancedFilters = useStore(
      store,
      (state: GlobalState) => state.explore.map.showAdvancedFilters,
      false
    );

    const filterButtonType = (buttonType) => {
      store.emit(new ToggleAdvancedFilters(false))
      store.emit(new UpdateFiltersToFilterButtonType(buttonType));
      store.emit(new ClearCurrentButton())
      if(pageName != 'Explore')
      {
        router.push('/Explore');
      } 
      
    };
    const [buttonTypes, setButtonTypes] = useState([]);
    useButtonTypes(setButtonTypes);
  
    return (
      <>
        {buttonTypes.map((buttonType, idx) => {
          const buttonTypeFound = selectedNetwork.buttonTypesCount.find(
            (buttonTypeCount) =>
              buttonTypeCount.type == buttonType.name,
          );
          const buttoTypeCountText =
            (buttonTypeFound?.count
              ? buttonTypeFound?.count
              : 0
            ).toString() +
            ' ' +
            buttonType.caption;
          return (
            <div
              className="hashtags__list-item"
              key={idx}
              style={buttonColorStyle(buttonType.cssColor)}
            >
              <Btn
                btnType={BtnType.filter}
                iconLeft={IconType.color}
                caption={buttoTypeCountText}
                onClick={() => filterButtonType(buttonType.name)}
              />
            </div>
          );
        })}
      </>
    );
  }