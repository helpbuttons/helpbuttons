export enum SchedulerUnity {
  HOUR = 'hour',
  DAY = 'day',
  MONTH = 'month'
}

export const calculateExpiringDate = (unity, value, date = new Date()) => {
  let expirationDate = date;
  switch(unity){
      case SchedulerUnity.HOUR:
          expirationDate.setHours(expirationDate.getHours() + value)
          break; 
      case SchedulerUnity.DAY:
          expirationDate.setDate(expirationDate.getDate() + value)
          break;
      case SchedulerUnity.MONTH:
          expirationDate.setMonth(expirationDate.getMonth() + value)
          break;
  }
  return expirationDate;
}

export const calculateRewnedDate = (unity, value, date = new Date()) => {
  let expirationDate = date;
  switch(unity){
      case SchedulerUnity.HOUR:
        expirationDate.setHours(expirationDate.getHours() - value)
        break; 
      case SchedulerUnity.DAY:
        expirationDate.setDate(expirationDate.getDate() - value)
        break;
      case SchedulerUnity.MONTH:
        expirationDate.setMonth(expirationDate.getMonth() - value)
        break;
  }
  return expirationDate;
}

export const schedulerPeriodicy = (unity, value) => {
  if(value > 1){
    return `${value} ${unity}s`
  }
  return `${value} ${unity}`
}