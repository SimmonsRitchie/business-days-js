/* eslint-disable no-undef */
import businessDays from "../index";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // dependent on utc plugin
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const bDays = businessDays("pa");
const DAYJS_TIMEZONE = "America/Los_Angeles";

test("Determine Dec 25, 2016 (Xmas day on Sunday) is not a business day because it's a weekend", () => {
  const dummyDate = dayjs.tz("2016-12-25", DAYJS_TIMEZONE);
  const businessDay = bDays.check(dummyDate);
  expect(businessDay).toBe(false);
});

test("Determine Dec 25, 2016 (Xmas day on Sunday) is not a business day, provided as Date object", () => {
  const businessDay = bDays.check(new Date('2016-12-25 00:00:00 GMT-0500'));
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
  const businessDay = bDays.check(new Date('2016-12-27 00:00:00 GMT-0500'));
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

test("Throw an error if 'new zealand' is provided as a state", () => {
  expect(() => {
    businessDays("New Zealand") 
  }).toThrow();
});

test("Get holidays for 2020", () => {
  const holidayList = bDays.getHolidays(2020);
  expect(Array.isArray(holidayList)).toBe(true);
});

test("Adding 5 business days to '2020-01-01' returns '2020-01-08", () => {
  const addedDate = bDays.addDays("2020-01-01", 5)
  const expectedDate = dayjs.tz("2020-01-08", DAYJS_TIMEZONE)
  expect(addedDate.isSame(expectedDate, "day")).toBe(true);
})

test("Adding 15 business days to '2020-01-01' returns '2020-01-23", () => {
  const addedDate = bDays.addDays("2020-01-01", 15)
  const expectedDate = dayjs.tz("2020-01-23", DAYJS_TIMEZONE)
  expect(addedDate.isSame(expectedDate, "day")).toBe(true);
})

test("Adding 15 business days to '2019-12-18' returns '2020-01-10", () => {
  const addedDate = bDays.addDays("2019-12-18", 15)
  const expectedDate = dayjs.tz("2020-01-10", DAYJS_TIMEZONE)
  expect(addedDate.isSame(expectedDate, "day")).toBe(true);
})

test("Adding 15 business days to '2019-12-18' doesn't return '2020-01-09", () => {
  const addedDate = bDays.addDays("2019-12-18", 15)
  const expectedDate = dayjs.tz("2020-01-09", DAYJS_TIMEZONE)
  expect(addedDate.isSame(expectedDate, "day")).toBe(false);
})

test("Adding 15 business days to '2019-12-18' with excludeInitialDate option to false returns '2020-01-09", () => {
  const addedDate = bDays.addDays("2019-12-18", 15, {excludeInitialDate: false})
  const expectedDate = dayjs.tz("2020-01-09", DAYJS_TIMEZONE)
  expect(addedDate.isSame(expectedDate, "day")).toBe(true);
})

// TODO: Add new tests for count days method
// test("Count days between '2019-12-18' to '2020-12-19 returns 1", () => {
//   const addedDate = bDays.addDays("2019-12-18", 15, {excludeInitialDate: false})
//   const expectedDate = dayjs.tz("2020-01-09", DAYJS_TIMEZONE)
//   expect(addedDate.isSame(expectedDate, "day")).toBe(true);
// })