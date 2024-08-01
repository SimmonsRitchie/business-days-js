import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // dependent on utc plugin
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Holidays from "date-holidays";
import { CustomHoliday } from "./types";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

/**
 * Throws error to the console if a US State abbreviation is invalid, otherwise returns true
 *
 * @param {string} stateAbbrv: State abbreviation. eg "pa"
 * @param {Holidays} hd: date-holidays instance
 * @returns {boolean} returns true if valid US state
 */
export const validateState = (stateAbbrv: string, hd: Holidays): boolean => {
  let stateList = Object.keys(hd.getStates("US"));
  stateList = [...stateList, "US", "USA"];
  const stateInList = stateList.includes(stateAbbrv.toUpperCase());
  if (!stateInList) {
    throw `${stateAbbrv} is not a US state.`;
  }
  return true;
};

/**
 * Throws error to the console if a Country abbreviation is invalid, otherwise returns true
 *
 * @param {string} countrybbrv: Country abbreviation. eg "AR"
 * @param {Holidays} hd: date-holidays instance
 * @returns {boolean} returns true if valid country
 */
export const validateCountry = (countrybbrv: string, hd: Holidays): boolean => {
  const countriesList = Object.keys(hd.getCountries());
  const countryInList = countriesList.includes(countrybbrv.toUpperCase());
  if (!countryInList) {
    throw `${countrybbrv} is not a valid Country Code.`;
  }
  return true;
};


/**
 * Checks that provided date is in valid format and returns date as a dayjs object.
 *
 * @param {string| Date | dayjs.Dayjs} inputDate - date to validate
 * @returns {Dayjs} inputDate converted into Dayjs object.
 */
export const validateDate = (inputDate: string| Date | dayjs.Dayjs): dayjs.Dayjs => {
  try {
    inputDate = dayjs.tz(inputDate, "YYYY-MM-DD", "America/New_York");
  } catch (e) {
    throw (
      ("Could not parse date. Please provide either a dayjs object, native Date object, or a string formatted as 'YYYY-MM-DD'")
    );
  }
  return inputDate;
};

/**
 * Gets the date-holiday defined 'rule' for a specific holiday. Returns empty string if name isn't found.
 *
 * @param {Holidays} hd - Holidays instance
 * @param {string} holName - name of holiday. eg. "Christmas Day"
 * @param {string | number | Date} year - year to search, defaults to current year if not provided.
 * @returns {string}
 */
export const getHolidayRule = (hd: Holidays, holName: string, year?: string | number | Date): string => {
  const holList = hd.getHolidays(year);
  const hol = holList.find((item) => {
    return item.name.toLowerCase() === holName.toLowerCase();
  });
  if (hol) {
    return hol.rule;
  }
  return "";
};

/**
 * Takes a Holidays instance and list of holidays and sets each holiday's type as 'optional' in the instance.
 * 
 * @param {Holidays} hd - Holidays instance
 * @param {string[]} arrHols - array of holiday names. eg ["Christmas Day", "New Year's Day"]
 * @param {string | number | Date} year - year to search, defaults to current year if not provided.
 * @returns {void} 
 */
export const filterHolidays = (hd: Holidays, arrHols: string[], year?: string | number | Date): void => {
  arrHols.forEach((holName) => {
    const rule = getHolidayRule(hd, holName, year);
    if (rule) {
      hd.setHoliday(rule, { name: holName, type: "optional" });
    }
  });
};

/**
 * Takes a Holidays instance and adds a list of custom public holidays.
 * 
 * @param {Holidays} hd - Holidays instance
 * @param {CustomHoliday[]} arrHols - list of objects representing custom holidays.
 * @returns {void} 
 */
export const addPublicHolidays = (hd: Holidays, arrHols: CustomHoliday[]): void => {
  arrHols.forEach(({ rule, name }) => {
    if (rule && name) {
      hd.setHoliday(rule, { name, type: "public" });
    } else {
      throw "Custom holidays must include a rule and a name";
    }
  });
};
