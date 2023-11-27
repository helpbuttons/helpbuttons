import { getLocale } from './sys.helper';
// good read: https://dockyard.com/blog/2020/02/14/you-probably-don-t-need-moment-js-anymore

export enum DateTypes {
  ALWAYS_ON = 'alwaysOn',
  ONCE = 'once',
  MULTIPLE = 'multiple',
  RECURRENT = 'recurrent',
}

export function readableTimeLeftToDate(date: Date) {
  // if(typeof date !== typeof Date) {
  //   date = new Date(date)
  // }

  // in miliseconds
  var units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
  };

  var rtf = new Intl.RelativeTimeFormat(getLocale(), {
    numeric: 'auto',
  });

  var getRelativeTime = (d1, d2 = new Date()) => {
    var elapsed = Date.parse(d1) - d2.getTime();
    // "Math.abs" accounts for both "past" & "future" scenarios
    for (var u in units)
      if (Math.abs(elapsed) > units[u] || u == 'second')
      {
        return rtf.format(Math.round(elapsed / units[u]), u);
      }
        
  };

  return getRelativeTime(new Date(date))
}

export function readableDateTime(date: Date) {
  if(typeof date !== typeof Date) {
    date = new Date(date)
  }

  return date.toLocaleDateString(getLocale(), {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}

export function readableDate(date: Date) {
  if(typeof date !== typeof Date) {
    date = new Date(date)
  }
  return date.toLocaleDateString(getLocale(), {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function readableShortDate(date: Date) {
  if(typeof date !== typeof Date) {
    date = new Date(date)
  }
  return date.toLocaleDateString(getLocale(), {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function readableTime(date: Date) {
  if(typeof date !== typeof Date) {
    date = new Date(date)
  }
  return new Intl.DateTimeFormat(getLocale(), {hour: 'numeric', minute: 'numeric'}).format(date);
}