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
        console.log(`${expirationDate.getDate()} + ${value}`) 

          expirationDate.setDate(expirationDate.getDate() + value)
          break;
      case SchedulerUnity.MONTH:
        console.log(`${expirationDate.getMonth()} + ${value}`) 

          expirationDate.setMonth(expirationDate.getMonth() + value)
          break;
  }
  return expirationDate;
}