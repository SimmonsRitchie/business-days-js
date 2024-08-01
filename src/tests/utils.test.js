/* eslint-disable no-undef */
import Holidays from "date-holidays";
import dayjs from "dayjs";
import {
  validateCountry,
  validateState,
  validateDate,
  getHolidayRule,
  filterHolidays,
  addPublicHolidays
} from "../utils";
import { CUSTOM_HOLIDAYS_2, CUSTOM_HOLIDAYS_ERROR_1 } from "./fixtures";

test("validateState throws an error when provided an invalid state", () => {
  const hd = new Holidays();
  expect(() => {
    validateState("XX", hd);
  }).toThrow();
});

test("validateState returns true when provided valid states", () => {
  const hd = new Holidays();
  const ca = validateState("ca", hd);
  const wv = validateState("wv", hd);
  const mo = validateState("mo", hd);
  expect(ca).toBe(true);
  expect(wv).toBe(true);
  expect(mo).toBe(true);
});

test("validateCoutry throws an error when provided an invalid state", () => {
  const hd = new Holidays();
  expect(() => {
    validateCountry("XX", hd);
  }).toThrow();
});

test("validateCoutry returns true when provided valid states", () => {
  const hd = new Holidays();
  const ar = validateCountry("AR", hd);
  const cl = validateCountry("CL", hd);
  const uy = validateCountry("UY", hd);
  expect(ar).toBe(true);
  expect(cl).toBe(true);
  expect(uy).toBe(true);
});


test("validateDate throws an error when provided an invalid date", () => {
  expect(() => {
    validateDate("MOTHBALLS");
  }).toThrow();
});

test("validateDate returns Day.js object with correct date when provided a valid date", () => {
  const dayJsObj = validateDate("2020-01-01");
  expect(dayJsObj instanceof dayjs).toBe(true);
  expect(dayJsObj.format("YYYY-MM-DD")).toBe("2020-01-01");
});

test("getHolidayRule returns correct date-holiday rule for Christmas Day", () => {
  const hd = new Holidays("US");
  const result = getHolidayRule(hd, "Christmas Day", 2020);
  const expectedRule =
    "12-25 and if sunday then next monday if saturday then previous friday";
  expect(result).toBe(expectedRule);
});

test("getHolidayRule returns correct date-holiday rule for Presidents' Day", () => {
  const hd = new Holidays("US", "pa");
  const result = getHolidayRule(hd, "Presidents' Day", 2020);
  const expectedRule = "3rd monday in February";
  expect(result).toBe(expectedRule);
});

test("getHolidayRule returns empty string when provided invalid holiday name", () => {
  const hd = new Holidays("US", "pa");
  const result = getHolidayRule(hd, "NOT A REAL HOLIDAY", 2020);
  const expectedRule = "";
  expect(result).toBe(expectedRule);
});

test("filterHolidays sets Christmas Day and Flag Day as optional on Holidays instance", () => {
  const hd = new Holidays("US", "pa");
  filterHolidays(hd, ["Christmas Day", "Flag Day"]);
  const optionalHols = hd
    .getHolidays()
    .filter((item) => item.type === "optional")
    .map((item) => item.name.toLowerCase());
  const publicHols = hd
    .getHolidays()
    .filter((item) => item.type === "public")
    .map((item) => item.name.toLowerCase());
  expect(optionalHols).toContain("christmas day");
  expect(optionalHols).toContain("flag day");
  expect(publicHols).not.toContain("christmas day");
  expect(publicHols).not.toContain("flag day");
});

test("addPublicHolidays adds Juneteenth and Groundhog Day", () => {
  const hd = new Holidays("US", "pa");
  addPublicHolidays(hd, CUSTOM_HOLIDAYS_2);
  const publicHols = hd
    .getHolidays()
    .filter((item) => item.type === "public")
    .map((item) => item.name.toLowerCase());
  expect(publicHols).toContain("groundhog day");
  expect(publicHols).toContain("juneteenth");
});


test("addPublicHolidays throws an error when no holiday name is provided", () => {
  expect(() => {
    const hd = new Holidays("US");
    addPublicHolidays(hd, CUSTOM_HOLIDAYS_ERROR_1);
  }).toThrow();
});
