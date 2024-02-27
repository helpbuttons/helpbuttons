import Btn, { BtnType, IconType } from "elements/Btn";
import router from "next/router";
import { store } from "pages";
import { useState } from "react";
import { buttonColorStyle, useButtonTypes } from "shared/buttonTypes";
import { UpdateFiltersToFilterButtonType } from "state/Explore";

export function ListButtonTypes({ selectedNetwork }) {
    const filterButtonType = (buttonType) => {
      store.emit(new UpdateFiltersToFilterButtonType(buttonType));
      router.push('/Explore');
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