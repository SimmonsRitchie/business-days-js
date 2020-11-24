const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc') // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone')
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)

var Holidays = require('date-holidays')
var hd = new Holidays()
hd.init('US', 'pa')


const isBusinessDay = (inputDate) => {
  /**
   * Returns false if input date is on a weekend or a public holiday in Pennsylvania, USA.
   * 
   * @param {dayjs} date as a dayjs object
   * @returns {bool} true if date is a weekend or holiday
   */
  if (typeof inputDate === "string") {
    try {
      inputDate = dayjs.tz(inputDate, 'YYYY-MM-DD', "America/New_York")
    } catch(e) {
      throw "Could not parse date. Please provide either a dayjs object or a string formatted as 'YYYY-MM-DD'", e
    }
  }

  // Check if Sun (0) or Sat (6)
  const dayOfWeek = inputDate.day()
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  // Check if public holiday or substitute public holiday
  const holidayObj = hd.isHoliday(inputDate.toDate())
  if (holidayObj && holidayObj.type === 'public') { 
    return false
  }
  return true;
}

module.exports = {
  isBusinessDay
}

