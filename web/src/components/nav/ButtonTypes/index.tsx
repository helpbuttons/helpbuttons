import Btn, { BtnType, IconType } from "elements/Btn";
import router from "next/router";
import { GlobalState, store } from "pages";
import { buttonColorStyle, useButtonTypes } from "shared/buttonTypes";
import { ToggleAdvancedFilters, UpdateFiltersToFilterButtonType, updateCurrentButton } from "state/Explore";
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
      store.emit(new updateCurrentButton(null))
      if(pageName != 'Explore')
      {
        router.push('/Explore');
      } 
      
    };
    const buttonTypes = useButtonTypes();
  
    return (
      <>
        {buttonTypes && buttonTypes.map((buttonType, idx) => {
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
                btnType={BtnType.filterEmoji}
                iconLeft={IconType.svg}
                iconLink={buttonType?.icon}
                caption={buttoTypeCountText}
                onClick={() => filterButtonType(buttonType.name)}
              />
            </div>
          );
        })}
      </>
    );
  }