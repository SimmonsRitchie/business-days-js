import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // dependent on utc plugin
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Holidays from "date-holidays";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);


const validateState = (stateAbbrv, hd) => {
  /**
   * Throws error to the console if a US State abbreviation is invalid.
   *
   * @param {str} stateAbbrv: State abbreviation. eg "pa"
   * @returns {undefined}
   */
  const stateList = Object.keys(hd.getStates("US"));
  stateList.push("USA")
  const stateInList = stateList.includes(stateAbbrv.toUpperCase());
  if (!stateInList) {
    throw `${stateAbbrv} is not a US state.`;
  }
}

const validateDate = (inputDate) => {
  /**
   * Checks that provided date is in valid format and returns date as a dayjs object.
   * 
   * @param {string|Dayjs|Date} inputDate - date to validate
   * @returns {Dayjs} inputDate converted into Dayjs object.
   */
  try {
    inputDate = dayjs.tz(inputDate, "YYYY-MM-DD", "America/New_York");
  } catch (e) {
    throw (
      ("Could not parse date. Please provide either a dayjs object, native Date object, or a string formatted as 'YYYY-MM-DD'",
      e)
    );
  }
  return inputDate;
}

const getHolidayRule = (hd, holName, year) => {
  /**
   * Gets the date-holiday defined 'rule' for a specific holiday. Returns empty string if name isn't found.
   * 
   * @param {Holidays} hd - Holidays instance
   * @param {string} holName - name of holiday. eg. "Christmas Day"
   * @returns {string} 
   */
  const holList = hd.getHolidays(year)
  const hol = holList.find(item => {
    return item.name.toLowerCase() === holName.toLowerCase()})
  if (hol) {
    return hol.rule;
  }
  return "";
}

const filterHolidays = (hd, arrHols) => {
  /**
   * Takes a Holidays instance and list of holidays and sets each holiday's type as 'optional' in the instance.
   * 
   * @param {Holidays} hd - Holidays instance
   * @param {arr} arrHols - array of holiday names. eg ["Christmas Day", "New Year's Day"]
   * @returns {undefined} 

   */
  arrHols.forEach(holName => {
    const rule = getHolidayRule(hd, holName, "2020")
    if (rule) {
      hd.setHoliday(rule, {name: holName, type: "optional"})
    }
  })
}

const businessDays = (USState="USA", {excludeHolidays = []} = {}) => {
  /**
   * Factory function that creates a businessDays object.
   *
   * @param {str} USState – U.S. state to determine holidays. Defaults to "USA"
   * @returns {str} true if date is a weekend or holiday
   */
  const cleanUSState = USState.toLowerCase();
  const hd = new Holidays();
  validateState(cleanUSState, hd);
  hd.init("US", cleanUSState);
  if (excludeHolidays.length > 0) {
    filterHolidays(hd, excludeHolidays)
  }
  return {
    hd,
    USState: cleanUSState,
    getHolidays(year) {
      /**
       * Returns an array of all public holidays for a given year.
       * 
       * @param {string} year – year to get holidays for
       * @returns {arr}
       */
      const publicHols = hd.getHolidays(year).filter(item => item.type === "public")
      return publicHols;
      // const publicHols = hols.filter(item => item.type === "public")
      // return publicHols;
    },
    check(inputDate) {
      /**
       * Returns false if input date is on a weekend or a public holiday in Pennsylvania, USA.
       *
       * @param {string|Dayjs|Date} inputDate - date to check.
       * @returns {bool} true if inputDate is a weekend or holiday
       */
      inputDate = validateDate(inputDate);
      // Check if Sun (0) or Sat (6)
      const dayOfWeek = inputDate.day();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false;
      }
      // Check if public holiday or substitute public holiday
      const holidayObj = this.hd.isHoliday(inputDate.toDate());
      if (holidayObj && holidayObj.type === "public") {
        return false;
      }
      return true;
    },
    addDays(inputDate, days, { excludeInitialDate=true }={}) {
      /**
       * Adds business days to a date and returns a new date as a DayJS object. First date is excluded from count by default.
       * 
       * @param {string|Dayjs|Date} inputDate - a date to begin calculation from.
       * @param {int} days - number of days to add to inputDate
       * @param {bool} [options.excludeInitialDate=true] - whether to exclude the first date when adding. 
       * @returns {dayjs} 
       */
      let counter = 0;
      inputDate = validateDate(inputDate)
      if (excludeInitialDate) {
        inputDate = inputDate.add(1, 'day')
      }
      while (counter < days) {
        if (this.check(inputDate)) {
          counter++;
        } 
        if (counter < days) {
          inputDate = inputDate.add(1, 'day')
        }
      }
      return inputDate;
    },
    countDays(dateStart, dateEnd, { excludeInitialDate=true }={}) {
      /**
       * Returns an object with a tally of the number of business days, weekend days, and public holidays between two dates. First date is excluded from count by default.
       * 
       * @param {string|Dayjs|Date} inputDate - a date to begin calculation from.
       * @param {int} days - number of days to add to inputDate
       * @param {bool} [options.excludeInitialDate=true] - whether to exclude the first date when adding. 
       * @returns {dayjs} 
       */
      dateStart = validateDate(dateStart)
      dateEnd = validateDate(dateEnd)
      if (dateStart.isAfter(dateEnd)) {
        throw `${dateStart} is after ${dateEnd}. Provide a start date that is earlier than end date in order to calculate days between`
      }
      let totalDays = 0;
      let holidays = 0;
      let holidayList = [];
      let weekendDays = 0;
      let weekdays = 0;
      let holidaysOnWeekends = 0;
      let businessDays = 0;
      let dateCounter = dateStart;
      if (excludeInitialDate) {
        dateCounter = dateStart.add(1, 'day')
      }
      while (!dateCounter.isSame(dateEnd.add(1, 'day'), 'day')) {
        totalDays++
        const holidayObj = this.hd.isHoliday(dateCounter.toDate());
        const dayOfWeek = dateCounter.day();
        if (holidayObj && holidayObj.type === "public") {
          holidays++;
          holidayList.push(holidayObj)
        }
        if (dayOfWeek === 0 | dayOfWeek === 6) {
          weekendDays++;
        }
        if (!(dayOfWeek === 0 | dayOfWeek === 6)) {
          weekdays++;
        }
        if ((dayOfWeek === 0 | dayOfWeek === 6) && (holidayObj && holidayObj.type === "public")) {
          holidaysOnWeekends++;
        }
        if (!(dayOfWeek === 0 | dayOfWeek === 6) && !(holidayObj && holidayObj.type === "public")) {
          businessDays++;
        }
        dateCounter = dateCounter.add(1, 'day')
      }
      return {
        totalDays,
        holidays,
        holidayList,
        weekdays,
        weekendDays,
        holidaysOnWeekends,
        businessDays,
        nonBusinessDays: totalDays - businessDays,
      }
    },
  };
};
export default businessDays;
