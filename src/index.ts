import Holidays from "date-holidays";
import dayjs from "dayjs";
import {
  validateState,
  validateCountry,
  validateDate,
  filterHolidays,
  addPublicHolidays,
} from "./utils";

/**
 * Factory function that creates a businessDays object.
 *
 * @param {string} options.state – U.S. state to determine holidays. Eg. "pa". Defaults to "USA"
 * @param {Array} options.excludeHolidays – list of strings with holiday names to exclude from being considered as non-business days.
 * @returns {businessDays} businessDays object
 */
const businessDays = ({
  country = "US",
  state = "US",
  excludeHolidays = [],
  addHolidays = [],
} = {}) => {
  const hd = new Holidays();

  if (country === "US")validateState(state, hd);
  else validateCountry(country, hd);

  const cleanUSState = state.toUpperCase();
  if (country !== "US") {
    hd.init(country);
  } else if (cleanUSState === "US" || cleanUSState === "USA") {
    hd.init("US");
  } else {
    hd.init("US", cleanUSState);
  }
  if (excludeHolidays.length > 0) {
    filterHolidays(hd, excludeHolidays);
  }
  if (addHolidays.length > 0) {
    addPublicHolidays(hd, addHolidays);
  }
  return {
    hd,
    USState: cleanUSState,
    /**
     * Returns an array of all public holidays for a given year. 
     *
     * @param {string | number | Date} year – year to get holidays for. Defaults to current year if not provided.
     * @returns {Array}
     */
    getHolidays(year?: string | number | Date) {
      const publicHols = this.hd
        .getHolidays(year)
        .filter((item) => item.type === "public");
      return publicHols;
      // const publicHols = hols.filter(item => item.type === "public")
      // return publicHols;
    },
    /**
     * Returns false if input date is on a weekend or a public holiday in Pennsylvania, USA.
     *
     * @param {string | Date | dayjs.Dayjs} inputDate - date to check.
     * @returns {bool} true if inputDate is a weekend or holiday
     */
    check(inputDate: string | Date | dayjs.Dayjs) {
      const dayJsObj: dayjs.Dayjs = validateDate(inputDate);
      // Check if Sun (0) or Sat (6)
      const dayOfWeek = dayJsObj.day();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false;
      }
      // Check if public holiday or substitute public holiday
      const holidayArr = this.hd.isHoliday(dayJsObj.toDate());
      if (holidayArr && holidayArr[0].type === "public") {
        return false;
      }
      return true;
    },
    /**
     * Adds business days to a date and returns a new date as a DayJS object. First date is excluded from count by default.
     *
     * @param {string | Date | dayjs.Dayjs} inputDate - a date to begin calculation from.
     * @param {number} days - number of days to add to inputDate
     * @param {bool} [options.excludeInitialDate=true] - whether to exclude the first date when adding.
     * @returns {dayjs}
     */
    addDays(inputDate: string | Date | dayjs.Dayjs, days: number, { excludeInitialDate = true } = {}) {
      let counter = 0;
      let dayJsObj: dayjs.Dayjs = validateDate(inputDate);
      if (excludeInitialDate) {
        dayJsObj = dayJsObj.add(1, "day");
      }
      while (counter < days) {
        if (this.check(dayJsObj)) {
          counter++;
        }
        if (counter < days) {
          dayJsObj = dayJsObj.add(1, "day");
        }
      }
      return dayJsObj;
    },
    /**
     * Returns an object with a tally of the number of business days, weekend days, and public holidays between two dates. First date is excluded from count by default.
     *
     * @param {string | Date | dayjs.Dayjs} dateStart - a date to begin calculation from.
     * @param {string | Date | dayjs.Dayjs} dateEnd - a date to begin calculation from.
     * @param {bool} [options.excludeInitialDate=true] - whether to exclude the first date when adding.
     * @returns {dayjs}
     */
    countDays(dateStart: string | Date | dayjs.Dayjs, dateEnd: string | Date | dayjs.Dayjs, { excludeInitialDate = true } = {}) {
      const dayJsStart: dayjs.Dayjs = validateDate(dateStart);
      const dayJsEnd: dayjs.Dayjs = validateDate(dateEnd);
      if (dayJsStart.isAfter(dayJsEnd)) {
        throw `${dateStart} is after ${dateEnd}. Provide a start date that is earlier than end date in order to calculate days between`;
      }
      let totalDays = 0;
      let holidays = 0;
      let holidayList = [];
      let weekendDays = 0;
      let weekdays = 0;
      let holidaysOnWeekends = 0;
      let businessDays = 0;
      let dateCounter = dayJsStart.clone();
      if (excludeInitialDate) {
        dateCounter = dayJsStart.add(1, "day");
      }
      while (!dateCounter.isSame(dayJsEnd.add(1, "day"), "day")) {
        totalDays++;
        const holidayArr = this.hd.isHoliday(dateCounter.toDate());
        const dayOfWeek = dateCounter.day();
        if (holidayArr && holidayArr[0].type === "public") {
          holidays++;
          holidayList.push(holidayArr[0]);
        }
        if ((dayOfWeek === 0) || (dayOfWeek === 6)) {
          weekendDays++;
        }
        if (!((dayOfWeek === 0) || (dayOfWeek === 6))) {
          weekdays++;
        }
        if (
          ((dayOfWeek === 0) || (dayOfWeek === 6)) &&
          (holidayArr &&
          holidayArr[0].type === "public")
        ) {
          holidaysOnWeekends++;
        }
        if (
          !((dayOfWeek === 0) || (dayOfWeek === 6)) &&
          !(holidayArr && holidayArr[0].type === "public")
        ) {
          businessDays++;
        }
        dateCounter = dateCounter.add(1, "day");
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
      };
    },
  };
};
export default businessDays;
