const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc"); // dependent on utc plugin
const timezone = require("dayjs/plugin/timezone");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
var Holidays = require("date-holidays");


const checkValidState = (stateAbbrv) => {
  /**
   * Logs warning to the console if a US State abbreviation is invalid
   * 
   * @param {str} stateAbbrv: State abbreviation. eg "pa"
   * @returns {undefined}
   */
  const hd = new Holidays();
  const stateList = Object.keys(hd.getStates('US'))
  const stateInList = stateList.includes(stateAbbrv.toUpperCase())
  if (!stateInList) {
    throw `${stateAbbrv} is not a US state.`
  }
}

const businessDays = (USState) => {
  /**
   * Factory function that creates a businessDays object.
   *
   * @param {str} USState: U.S. state to determine holidays
   * @returns {str} true if date is a weekend or holiday
   */
  const cleanUSState = USState.toLowerCase()
  checkValidState(cleanUSState)
  const hd = new Holidays();
  hd.init("US", cleanUSState);
  return {
    USState: cleanUSState,
    getHolidays (year) {
      /**
       * Returns a list of all holidays for a given year.
       */
       return hd.getHolidays(year)
    },
    check(inputDate) {
      /**
       * Returns false if input date is on a weekend or a public holiday in Pennsylvania, USA.
       *
       * @param {dayjs} date as a dayjs object
       * @returns {bool} true if date is a weekend or holiday
       */

      try {
        inputDate = dayjs.tz(inputDate, "YYYY-MM-DD", "America/New_York");
      } catch (e) {
        throw (
          ("Could not parse date. Please provide either a dayjs object, native Date object, or a string formatted as 'YYYY-MM-DD'",
          e)
        );
      }

      // Check if Sun (0) or Sat (6)
      const dayOfWeek = inputDate.day();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false;
      }
      // Check if public holiday or substitute public holiday
      const holidayObj = hd.isHoliday(inputDate.toDate());
      if (holidayObj && holidayObj.type === "public") {
        return false;
      }
      return true;
    },
  };
};
export default businessDays;
