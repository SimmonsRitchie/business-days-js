/* eslint-disable no-undef */
import Holidays from "date-holidays";
import dayjs from "dayjs";
import {
  validateState,
  validateDate,
  filterHolidays,
  addPublicHolidays,
} from "../utils";

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
