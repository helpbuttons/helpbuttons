import { applyCustomFieldsFilters } from "components/button/ButtonType/CustomFields/AdvancedFiltersCustomFields";
import { isPointWithinRadius } from "geolib";
import { Point } from "pigeon-maps";
import { Button } from "shared/entities/button.entity";
import { recalculateDensityMap } from "shared/honeycomb.utils";

export interface ButtonFilters {
    helpButtonTypes: string[];
    query: string;
    where: { address: string; center: Point; radius: number };
    orderBy: string;
    tags: string[]
    days: number;
  }
  
  export const defaultFilters: ButtonFilters = {
    helpButtonTypes: [],
    query: '',
    where: { address: null, center: null, radius: null },
    orderBy: 'date',
    tags: [],
    days: 10,
  };
  
  const applyButtonTypesFilter = (button, buttonTypes) => {
    if (buttonTypes.length == 0) {
      return true;
    }
    if (buttonTypes.length > 0) {
      return buttonTypes.indexOf(button.type) > -1;
    }
    return false;
  };

  const applyQueryFilter = (button, query) => {
    if (query && query.length > 0) {
      return (
        button.title.indexOf(query) > -1 ||
        button.description.indexOf(query) > -1
      );
    }
    return true;
  };

  const applyWhereFilter = (button: Button, where) => {
    if (where.center && where.radius) {
      return isPointWithinRadius(
        { latitude: button.latitude, longitude: button.longitude },
        { latitude: where.center[0], longitude: where.center[1] },
        where.radius *1,
      );
    }
    return true;
  };

  const applyTagFilters = (button: Button, tags: string[]) => {
    if (tags.length == 0) {
      return true;
    }
    if (tags.length > 0) {
      const tagsFound = _.intersection(tags, button.tags);
      if (tagsFound.length > 0) {
        return true;
      }
    }
    return false;
  };

  const applyFilterToButton = (button, filters, buttonTypes) => {
      if (
        !applyButtonTypesFilter(button, filters.helpButtonTypes)
      ) {
        return false;
      }
      if (!applyTagFilters(button, filters.tags)) {
        return false;
      }
      let query = filters.query;
      if (!applyQueryFilter(button, query)) {
        return false;
      }
      if (!applyWhereFilter(button, filters.where)) {
        return false;
      }
      if (
        !applyCustomFieldsFilters(button, filters, buttonTypes)
      ) {
        return false;
      }
      return true;
  }

  
  export const applyFiltersHex = (filters, cachedHexagons, buttonTypes) => {
    const res = cachedHexagons.reduce(
      ({ filteredButtons, filteredHexagons }, hexagonCached) => {
        const moreButtons = hexagonCached.buttons.filter(
          (button: Button) =>  applyFilterToButton(button, filters, buttonTypes)
        );

        filteredHexagons.push({
          ...hexagonCached,
          buttons: moreButtons,
        });
        return {
          filteredButtons: filteredButtons.concat(moreButtons),
          filteredHexagons: filteredHexagons,
        };
      },
      { filteredButtons: [], filteredHexagons: [] },
    );

    return {
      filteredButtons: res.filteredButtons,
      filteredHexagons: recalculateDensityMap(res.filteredHexagons),
    };
  }
  export const applyFilters = (filters, buttonList, buttonTypes) => {
    const filteredButtons = buttonList.filter(
      (button: Button) => applyFilterToButton(button, {...filters, where: {center: null, radius: null}}, buttonTypes)
    );
    return {filteredButtons}    
  };