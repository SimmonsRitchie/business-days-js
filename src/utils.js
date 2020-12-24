import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // dependent on utc plugin
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const validateState = (stateAbbrv, hd) => {
  /**
   * Throws error to the console if a US State abbreviation is invalid, otherwise returns true
   *
   * @param {str} stateAbbrv: State abbreviation. eg "pa"
   * @returns {boolean} returns true if valid US state
   */
  const stateList = Object.keys(hd.getStates("US"));
  stateList.push("USA");
  const stateInList = stateList.includes(stateAbbrv.toUpperCase());
  if (!stateInList) {
    throw `${stateAbbrv} is not a US state.`;
  }
  return true;
};

export const validateDate = (inputDate) => {
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
};

export const getHolidayRule = (hd, holName, year) => {
  /**
   * Gets the date-holiday defined 'rule' for a specific holiday. Returns empty string if name isn't found.
   *
   * @param {Holidays} hd - Holidays instance
   * @param {string} holName - name of holiday. eg. "Christmas Day"
   * @returns {string}
   */
  const holList = hd.getHolidays(year);
  const hol = holList.find((item) => {
    return item.name.toLowerCase() === holName.toLowerCase();
  });
  if (hol) {
    return hol.rule;
  }
  return "";
};

export const filterHolidays = (hd, arrHols) => {
  /**
   * Takes a Holidays instance and list of holidays and sets each holiday's type as 'optional' in the instance.
   * 
   * @param {Holidays} hd - Holidays instance
   * @param {Array.<string>} arrHols - array of holiday names. eg ["Christmas Day", "New Year's Day"]
   * @returns {undefined} 

   */
  arrHols.forEach((holName) => {
    const rule = getHolidayRule(hd, holName, "2020");
    if (rule) {
      hd.setHoliday(rule, { name: holName, type: "optional" });
    }
  });
};

export const addPublicHolidays = (hd, arrHols) => {
  /**
   * Takes a Holidays instance and adds a list of custom public holidays.
   * 
   * @param {Holidays} hd - Holidays instance
   * @param {Array.<Object>} arrHols - list of objects representing custom holidays.
   * @returns {undefined} 

   */
  arrHols.forEach(({ rule, name }) => {
    if (rule && name) {
      hd.setHoliday(rule, { name, type: "public" });
    } else {
      throw "Custom holidays must include a rule and a name";
    }
  });
};
