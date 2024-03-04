import React from 'react';
import { readableDayOfWeek } from 'shared/date.utils';

export default function WeekDayPicker({
  selectedWeekDays,
  setSelectedWeekDays,
}) {
  const elements = days(new Date());

  const add = (weekday) => {
    setSelectedWeekDays([...selectedWeekDays, weekday]);
  };
  const remove = (newweekday) => {
    if(selectedWeekDays.length > 1){
        setSelectedWeekDays(selectedWeekDays.filter(weekday => weekday !== newweekday));
    }
};
  return (
    <div>
      <ElementsList
        elements={elements}
        selectedElements={selectedWeekDays}
        add={add}
        remove={remove}
      />
    </div>
  );
}

function ElementsList({
  elements = [],
  selectedElements = [],
  add,
  remove,
}) {
  const isSelected = (weekday) => {
    if (
      selectedElements.length > 0 &&
      selectedElements.indexOf(weekday) > -1
    ) {
      return true;
    }
    return false;
  };

  const toggle = (weekday) => {
    if (isSelected(weekday)) {
      remove(weekday);
      return;
    }
    add(weekday);
  };

  return (
    <div className="form__tags-list">
      <ul className="tags__list">
        {elements.length > 0 &&
          elements.map(({idx, label}, index) => {
            return (
              <Element
                item={label}
                index={index}
                onClick={() => {
                  toggle(idx);
                }}
                selected={selectedElements.indexOf(idx) > -1}
                key={index}
              />
            );
          })}
      </ul>
    </div>
  );
}

function Element({ index, item, onClick, selected = false }) {
  return (
    <>
      {selected && (
        <li
          className="tags__list-interest__selected"
          onClick={onClick}
        >
          {item}
        </li>
      )}
      {!selected && (
        <li className="tags__list-interest" onClick={onClick}>
          {item}
        </li>
      )}
    </>
  );
}

function days(current) {
  var week = new Array();
  // Starting Monday not Sunday
  var first = current.getDate() - current.getDay() + 1;
  for (var i = 0; i < 7; i++) {
    week.push({idx: i, label: readableDayOfWeek(new Date(current.setDate(first++)))}); 
  }
  return week;
}

  