/* eslint-disable no-undef */
import businessDays from "../index";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // dependent on utc plugin
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CUSTOM_HOLIDAYS_1, CUSTOM_HOLIDAYS_2 } from "./fixtures";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const bDays = businessDays({ state: "pa" });
const DAYJS_TIMEZONE = "America/Los_Angeles";

// BASIC INIT
test("Initializing businessDays without a state abbreviation returns object", () => {
  const bDaysObj = businessDays();
  expect(typeof bDaysObj === "object").toBe(true);
});

test("Initializing businessDays without a state abbreviation but with excludeHolidays option returns object", () => {
  const bDaysObj = businessDays({ excludeHolidays: ["Washington's Birthday"] });
  expect(typeof bDaysObj === "object").toBe(true);
});

test("Initializing businessDays with a state abbreviation returns object", () => {
  const bDaysObj = businessDays({ state: "pa" });
  expect(typeof bDaysObj === "object").toBe(true);
});

test("Initializing businessDays with a country abbreviation returns object", () => {
  const bDaysObj = businessDays({ country: "AR" });
  expect(typeof bDaysObj === "object").toBe(true);
});


test("Initializing businessDays with an invalid state abbreviation throws an error", () => {
  expect(() => {
    businessDays({ state: "NZ" });
  }).toThrow();
});

// GET HOLIDAYS
test("getHolidays returns an array", () => {
  const holidayList = bDays.getHolidays(2020);
  expect(Array.isArray(holidayList)).toBe(true);
});

test("getHolidays returns 10 public holidays in 2020 when businessDays is initalized without state abbreviation", () => {
  const bDaysObj = businessDays();
  const holidayList = bDaysObj.getHolidays(2020);
  expect(holidayList.length).toBe(11); // list includes substitution for Independence Day
  const holsNoSubs = holidayList.filter((item) => !item.substitute);
  expect(holsNoSubs.length).toBe(10);
});

test("getHolidays returns 11 public holidays in 2022 when businessDays is initalized without state abbreviation", () => {
  // Juneteenth was added as a public holiday in 2021, bringing the number of federal holidays to 11
  const bDaysObj = businessDays();
  const holidayList = bDaysObj.getHolidays(2022);
  const holsNoSubs = holidayList.filter((item) => !item.substitute);
  expect(holsNoSubs.length).toBe(11);
});

test("getHolidays returns 12 public holidays in 2022 when businessDays is configured for Pennsylvania", () => {
  // Pennsylvania considers Flag Day (06-14) a public holiday in addition to the 11 federal holidays
  const bDaysObj = businessDays({ state: "pa" });
  const holidayList = bDaysObj.getHolidays(2022);
  const holsNoSubs = holidayList.filter((item) => !item.substitute);
  expect(holsNoSubs.length).toBe(12);
});

test("getHolidays returns 12 public holidays in 2022 when businessDays is configured for country Argentina", () => {
  // Pennsylvania considers Flag Day (06-14) a public holiday in addition to the 11 federal holidays
  const bDaysObj = businessDays({ country: "AR" });
  const holidayList = bDaysObj.getHolidays(2022);
  const holsNoSubs = holidayList.filter((item) => !item.substitute);
  expect(holsNoSubs.length).toBe(20);
});

// CHECK DAYS
test("Determine Dec 25, 2016 (Xmas day on Sunday) is not a business day because it's a weekend", () => {
  const dummyDate = dayjs.tz("2016-12-25", DAYJS_TIMEZONE);
  const businessDay = bDays.check(dummyDate);
  expect(businessDay).toBe(false);
});

test("Determine Dec 25, 2016 (Xmas day on Sunday) is not a business day, provided as Date object", () => {
  const businessDay = bDays.check(new Date("2016-12-25 00:00:00 GMT-0500"));
  expect(businessDay).toBe(false);
});

test("Determine Fri, July 3, 2020 is not a business day because it's substitute day for Independence Day", () => {
  const dummyDate = dayjs.tz("2020-07-03", DAYJS_TIMEZONE);
  const businessDay = bDays.check(dummyDate);
  expect(businessDay).toBe(false);
});

test("Determine Dec 26, 2016 is not a business day because it's substitute day for Christmas", () => {
  const dummyDate = dayjs.tz("2016-12-26", DAYJS_TIMEZONE);
  const businessDay = bDays.check(dummyDate);
  expect(businessDay).toBe(false);
});

test("Determine Dec 27, 2016 is a business day because it's not a weekend or public holiday", () => {
  const dummyDate = dayjs.tz("2016-12-27", DAYJS_TIMEZONE);
  const businessDay = bDays.check(dummyDate);
  expect(businessDay).toBe(true);
});

test("Determine Dec 27, 2016 is a business day because it's not a weekend or public holiday, provided as a Date object", () => {
  const businessDay = bDays.check(new Date("2016-12-27 00:00:00 GMT-0500"));
  expect(businessDay).toBe(true);
});

test("Determine the string '2006-12-25' (Xmas day) is not a business day", () => {
  const dummyDate = "2016-12-25";
  const businessDay = bDays.check(dummyDate);
  expect(businessDay).toBe(false);
});

test("Determine the string '2006-12-26' (substitute for Xmas day) is not a business day", () => {
  const dummyDate = "2016-12-26";
  const businessDay = bDays.check(dummyDate);
  expect(businessDay).toBe(false);
});

test("Determine the string '2016-12-27' (a Tuesday) is a business day", () => {
  const dummyDate = "2016-12-27";
  const businessDay = bDays.check(dummyDate);
  expect(businessDay).toBe(true);
});

test("Determine the string '2021-12-27' (a Wednesday) is a business day", () => {
  const dummyDate = "2021-11-17";
  const businessDay = bDays.check(dummyDate);
  expect(businessDay).toBe(true);
});

test("Determine the string '2016-02-15' (Presidents Day) is not a business day", () => {
  const dummyDate = dayjs.tz("2016-02-15", DAYJS_TIMEZONE);
  const businessDay = bDays.check(dummyDate);
  expect(businessDay).toBe(false);
});

test("Throw an error if input date is formatted as '27-12-2016' is provided", () => {
  const dummyDate = "27-12-2016";
  expect(() => {
    bDays.check(dummyDate);
  }).toThrow();
});

test("Determine '2020-12-25' is a business day if Christmas Day is set as not a public holiday", () => {
  const bDaysFiltered = businessDays({
    state: "pa",
    excludeHolidays: ["Christmas Day"],
  });
  const xmasDay = dayjs.tz("2020-12-25", DAYJS_TIMEZONE);
  const businessDay = bDaysFiltered.check(xmasDay);
  expect(businessDay).toBe(true);
});

test("Determine '2019-06-14' (Flag Day) is not a business day", () => {
  const dummyDate = dayjs.tz("2019-06-14", DAYJS_TIMEZONE);
  const businessDay = bDays.check(dummyDate);
  expect(businessDay).toBe(false);
});

test("Determine '2019-06-14' (Flag Day) is a business day if Flag Day is excluded from holiday list", () => {
  const bDaysFiltered = businessDays({
    state: "pa",
    excludeHolidays: ["Flag Day"],
  });
  const flagDay = dayjs.tz("2019-06-14", DAYJS_TIMEZONE);
  const businessDay = bDaysFiltered.check(flagDay);
  expect(businessDay).toBe(true);
});

// ADD DAYS
test("Adding 5 business days to '2020-01-01' returns '2020-01-08", () => {
  const addedDate = bDays.addDays("2020-01-01", 5);
  const expectedDate = dayjs.tz("2020-01-08", DAYJS_TIMEZONE);
  expect(addedDate.isSame(expectedDate, "day")).toBe(true);
});

test("Adding 15 business days to '2020-01-01' returns '2020-01-23", () => {
  const addedDate = bDays.addDays("2020-01-01", 15);
  const expectedDate = dayjs.tz("2020-01-23", DAYJS_TIMEZONE);
  expect(addedDate.isSame(expectedDate, "day")).toBe(true);
});

test("Adding 15 business days to '2019-12-18' returns '2020-01-10", () => {
  const addedDate = bDays.addDays("2019-12-18", 15);
  const expectedDate = dayjs.tz("2020-01-10", DAYJS_TIMEZONE);
  expect(addedDate.isSame(expectedDate, "day")).toBe(true);
});

test("Adding 15 business days to '2019-12-18' doesn't return '2020-01-09", () => {
  const addedDate = bDays.addDays("2019-12-18", 15);
  const expectedDate = dayjs.tz("2020-01-09", DAYJS_TIMEZONE);
  expect(addedDate.isSame(expectedDate, "day")).toBe(false);
});

test("Adding 15 business days to '2019-12-18' with excludeInitialDate option to false returns '2020-01-09", () => {
  const addedDate = bDays.addDays("2019-12-18", 15, {
    excludeInitialDate: false,
  });
  const expectedDate = dayjs.tz("2020-01-09", DAYJS_TIMEZONE);
  expect(addedDate.isSame(expectedDate, "day")).toBe(true);
});

// COUNT DAYS
test("Count days between '2020-12-20' to '2020-12-20' returns 0 or an empty list for all tallies", () => {
  const counts = bDays.countDays("2020-12-20", "2020-12-20");
  const expectedCounts = {
    totalDays: 0,
    holidays: 0,
    holidayList: [],
    weekdays: 0,
    weekendDays: 0,
    holidaysOnWeekends: 0,
    businessDays: 0,
    nonBusinessDays: 0,
  };
  expect(counts).toEqual(expectedCounts);
});

test("Count days between '2020-12-20' to '2020-12-21' returns expected tallies", () => {
  const counts = bDays.countDays("2020-12-20", "2020-12-21");
  const expectedCounts = {
    totalDays: 1,
    holidays: 0,
    holidayList: [],
    weekdays: 1,
    weekendDays: 0,
    holidaysOnWeekends: 0,
    businessDays: 1,
    nonBusinessDays: 0,
  };
  expect(counts).toEqual(expectedCounts);
});

test("Count days between '2020-12-20' to '2020-12-21' with excludeInitialDate set to false returns expected tallies", () => {
  // Sunday Dec 20, 2020 to Monday Dec 21, 2020
  const counts = bDays.countDays("2020-12-20", "2020-12-21", {
    excludeInitialDate: false,
  });
  const expectedCounts = {
    totalDays: 2,
    holidays: 0,
    holidayList: [],
    weekdays: 1,
    weekendDays: 1,
    holidaysOnWeekends: 0,
    businessDays: 1,
    nonBusinessDays: 1,
  };
  expect(counts).toEqual(expectedCounts);
});

test("Count days between '2020-12-23' to '2020-12-26' returns expected tallies", () => {
  // Sunday Dec 23, 2020 to Monday Dec 26, 2020
  const counts = bDays.countDays("2020-12-23", "2020-12-26");
  const { holidayList, ...newCounts } = counts;
  const expectedCounts = {
    totalDays: 3,
    holidays: 1,
    weekdays: 2,
    weekendDays: 1,
    holidaysOnWeekends: 0,
    businessDays: 1,
    nonBusinessDays: 2,
  };
  expect(newCounts).toEqual(expectedCounts);
  expect(holidayList.length).toBe(1);
  expect(holidayList[0].name).toBe("Christmas Day");
});

test("Count days between '2020-12-23' to '2021-01-02' returns expected tallies", () => {
  // Sunday Dec 23, 2020 to Sat Jan 2, 2020
  const counts = bDays.countDays("2020-12-23", "2021-01-02");
  const { holidayList, ...newCounts } = counts;
  const expectedCounts = {
    totalDays: 10,
    holidays: 2,
    weekdays: 7,
    weekendDays: 3,
    holidaysOnWeekends: 0,
    businessDays: 5,
    nonBusinessDays: 5,
  };
  expect(newCounts).toEqual(expectedCounts);
  expect(holidayList.length).toBe(2);
});

test("Count days between '2020-01-01' to '2020-12-31' with Christmas and Memorial Day excluded returns an array of 10 holidays", () => {
  // Sunday Dec 23, 2020 to Sat Jan 2, 2020
  const bDaysFiltered = businessDays({
    state: "pa",
    excludeHolidays: ["Christmas Day", "Memorial Day"],
  });
  const counts = bDaysFiltered.countDays("2020-01-01", "2020-12-31", {
    excludeInitialDate: false,
  });
  expect(counts.holidayList.length).toBe(10);
});

test("Throw an error if countDays recieves a start date that is after an end date", () => {
  expect(() => {
    bDays.countDays("2020-12-21", "2020-12-20", { excludeInitialDate: false });
  }).toThrow();
});

// CUSTOM HOLIDAYS
test("Exclude Flag Day, Christmas Day, and Presidents' Day from default public holiday list", () => {
  const bDaysObj = businessDays({
    state: "pa",
    excludeHolidays: ["Flag Day", "Christmas Day", "Presidents' Day"],
  });
  const holidayList = bDaysObj.getHolidays(2020);
  const holidayListClean = holidayList.map((item) => item.name.toLowerCase());
  expect(holidayListClean).not.toContain("flag day");
  expect(holidayListClean).not.toContain("christmas day");
  expect(holidayListClean).not.toContain("presidents' day");
  expect(holidayListClean).toContain("labor day");
  const xmasDay2020 = "2020-12-25";
  const presDay2015 = "2015-02-16";
  const flagDay2017 = "2017-06-14";
  expect(bDaysObj.check(xmasDay2020)).toBe(true);
  expect(bDaysObj.check(presDay2015)).toBe(true);
  expect(bDaysObj.check(flagDay2017)).toBe(true);
});

test("Add Groundhog Day to public holiday list", () => {
  const bDaysObj = businessDays({
    state: "pa",
    addHolidays: CUSTOM_HOLIDAYS_1,
  });
  const holidayList = bDaysObj.getHolidays(2018);
  const holidayListClean = holidayList.map((item) => item.name.toLowerCase());
  expect(holidayListClean).toContain("groundhog day");
  expect(holidayListClean.length).toBe(12);
  const groundhogDay2018 = "2018-02-02"; // Friday, Feb 2, 2018
  expect(bDaysObj.check(groundhogDay2018)).toBe(false);
});

test("Add Groundhog Day and Saint Swithin's Day to public holiday list for Pa.", () => {
  const bDaysObj = businessDays({
    state: "pa",
    addHolidays: CUSTOM_HOLIDAYS_2,
  });
  const holidayList = bDaysObj.getHolidays(2023);
  const holidayListClean = holidayList.filter(item => !item.substitute).map((item) => item.name.toLowerCase());
  expect(holidayListClean).toContain("groundhog day");
  expect(holidayListClean).toContain("saint swithin's day");
  expect(holidayListClean.length).toBe(14);
  const groundhogDay2023 = "2023-02-02"; // February 2, 2023
  const juneteenth2023 = "2023-07-15"; // July 15, 2023
  expect(bDaysObj.check(groundhogDay2023)).toBe(false);
  expect(bDaysObj.check(juneteenth2023)).toBe(false);
});

test("Add Groundhog Day and exclude Christmas Day and Presidents' Day", () => {
  const bDaysObj = businessDays({
    state: "pa",
    excludeHolidays: ["christmas day", "presidents' day"],
    addHolidays: CUSTOM_HOLIDAYS_1,
  });
  const holidayList = bDaysObj.getHolidays(2018);
  const holidayListClean = holidayList.map((item) => item.name.toLowerCase());
  expect(holidayListClean).toContain("groundhog day");
  expect(holidayListClean).not.toContain("christmas day");
  expect(holidayListClean).not.toContain("presidents' day");
  expect(holidayListClean.length).toBe(10);
  const groundhogDay2018 = "2018-02-02"; // Friday, Feb 2, 2018
  const xmasDay2020 = "2020-12-25"; // Fri, Dec 25, 2020
  const presDay2022 = "2022-02-21"; // Mon, Feb 21, 2022
  expect(bDaysObj.check(groundhogDay2018)).toBe(false);
  expect(bDaysObj.check(xmasDay2020)).toBe(true);
  expect(bDaysObj.check(presDay2022)).toBe(true);
});
