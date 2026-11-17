import produce from "immer";
import { GlobalState } from "state";
import { UpdateEvent } from "store/Event";
import { clearOnSelection } from "./Explore";

export class UpdateProvinceClicked implements UpdateEvent {
    public constructor(private provinceClicked: string) { }
  
    public update(state: GlobalState) {
      return produce(state, (newState) => {
        newState.explore.map.filters.provinceClicked = this.provinceClicked;
        if (this.provinceClicked) {
          newState = clearOnSelection(newState, state)
        }
        newState.explore.map.filters.hexClickedBtnType = null;
        newState.explore.map.filters.provinceBtnTypeClicked = null;
      });
    }
  }


  export class UpdateProvinceButtonTypeClicked implements UpdateEvent{
    public constructor(private buttonTypeClicked) { }
  
    public update(state: GlobalState) {
      return produce(state, (newState) => {
        newState.explore.map.filters.provinceBtnTypeClicked = this.buttonTypeClicked;
        newState.explore.currentButton = null;
      });
    }
  }