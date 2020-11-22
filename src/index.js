var Holidays = require('date-holidays')
var hd = new Holidays()
dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc') // dependent on utc plugin
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)
hd.init('US', 'pa')


const checkBusinessDay = (inputDate) => {
  /**
   * Returns true if input date is on a weekend or a public holiday in Pennsylvania, USA.
   * 
   * @param {dayjs} date as a dayjs object
   * @returns {bool} true if date is a weekend or holiday
   */
  // Check if Sun (0) or Sat (6)
  const dayOfWeek = inputDate.day()
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return true;
  }
  // Check if public holiday or substitute
  const holidayObj = hd.isHoliday(inputDate.toDate())
  if (holidayObj && holidayObj.type === 'public') { 
    return true
  }
  return false;
}

const dummyDate = dayjs.tz('2016-12-26', "America/New_York")
const isBusinessDay = checkBusinessDay(dummyDate)
console.log(isBusinessDay)