import { getResolution } from "h3-js";
import produce from "immer";
import { GlobalState, store } from "pages";
import { getZoomResolution } from "shared/honeycomb.utils";
import { UpdateEvent, WatchEvent } from "store/Event";
import { UpdateHexagonClicked } from "./Explore";
import { of } from "rxjs";


export class UpdateZoom implements WatchEvent, UpdateEvent {
    public constructor(private newZoom: number) {}
    public watch(state: GlobalState) {

        if (
            getResolution(state.explore.settings.hexagonClicked) !=
              getZoomResolution(Math.floor(this.newZoom))
          ) {
            
            store.emit(new UpdateHexagonClicked(null))
          }
          return of(undefined)
      }
    public update(state: GlobalState) {
      return produce(state, (newState) => {

        if(this.newZoom != state.explore.settings.zoom)
        {
          newState.explore.settings.prevZoom = state.explore.settings.zoom
          newState.explore.settings.zoom = Math.floor(this.newZoom);
        }
      });
    }
}