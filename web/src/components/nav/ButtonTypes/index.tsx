import { BtnCaption } from 'elements/Btn';
import router from 'next/router';
import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
import {
  ToggleAdvancedFilters,
  UpdateFiltersToFilterButtonType,
  updateCurrentButton,
} from 'state/Explore';
import { useStore } from 'store/Store';

export function ListButtonTypes({ selectedNetwork, pageName }) {
  const showAdvancedFilters = useStore(
    store,
    (state: GlobalState) => state.explore.map.showAdvancedFilters,
    false,
  );

  const [buttonTypes, setButtonTypes] = useState([]);
  useEffect(() => {
    if (buttonTypes) {
      if (selectedNetwork) {
        setButtonTypes(() => {
          return selectedNetwork.buttonTemplates.map((buttonType) => {
            const typeCount = selectedNetwork.buttonTypesCount.find(
              (buttonTypeCount) =>
                buttonTypeCount.type == buttonType.name,
            );
            if (typeCount) {
              return { ...buttonType, count: typeCount.count };
            }
            return buttonType;
          });
        });
      } else {
        setButtonTypes(() => {
          return selectedNetwork.buttonTemplates;
        });
      }
    }
  }, [selectedNetwork]);

  return (
    <ButtonTypesNav buttonTypes={buttonTypes} pageName={pageName} />
  );
}

export function ButtonTypesNav({ buttonTypes, pageName = '' }) {
  const filterButtonType = (buttonType) => {
    store.emit(new ToggleAdvancedFilters(false));
    store.emit(new UpdateFiltersToFilterButtonType(buttonType));
    store.emit(new updateCurrentButton(null));
    if (pageName != 'Explore') {
      router.push('/Explore');
    }
  };
  return (
    <>
      {buttonTypes &&
        buttonTypes.map((buttonType, idx) => {
          const buttoTypeCountText =
            (buttonType?.count ? buttonType?.count : 0).toString() +
            ' ' +
            buttonType.caption;
          return (
            <div className="hashtags__list-item" key={idx}>
              <BtnCaption
                caption={buttoTypeCountText}
                icon={buttonType?.icon}
                color={buttonType.cssColor}
                onClick={() => filterButtonType(buttonType.name)}
              />
            </div>
          );
        })}
    </>
  );
}
