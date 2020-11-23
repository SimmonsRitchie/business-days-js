const {isBusinessDay} = require("../index")
dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc') // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)


test("Determine Dec 25, 2016 (Xmas day on Sunday) is not a business day because it's a weekend", () => {
  const dummyDate = dayjs.tz('2016-12-25', "America/New_York")
  const businessDay = isBusinessDay(dummyDate)
  expect(businessDay).toBe(false)
})

test("Determine Dec 26, 2016 is not a business day because it's substitute day for Christmas", () => {
  const dummyDate = dayjs.tz('2016-12-26', "America/New_York")
  const businessDay = isBusinessDay(dummyDate)
  expect(businessDay).toBe(false)
})

test("Determine Dec 27, 2016 is a business day because it's not a weekend or public holiday", () => {
  const dummyDate = dayjs.tz('2016-12-27', "America/New_York")
  const businessDay = isBusinessDay(dummyDate)
  expect(businessDay).toBe(true)
})

test("Determine the string '2006-12-25' (Xmas day) is not a business day", () => {
  const dummyDate = '2016-12-25'
  const businessDay = isBusinessDay(dummyDate)
  expect(businessDay).toBe(false)
})

test("Determine the string '2006-12-26' (substitute for Xmas day) is not a business day", () => {
  const dummyDate = '2016-12-26'
  const businessDay = isBusinessDay(dummyDate)
  expect(businessDay).toBe(false)
})


test("Determine the string '2016-12-27' (a Tuesday) is a business day", () => {
  const dummyDate = '2016-12-27'
  const businessDay = isBusinessDay(dummyDate)
  expect(businessDay).toBe(true)
})

test("Determine the string '2021-12-27' (a Wednesday) is a business day", () => {
  const dummyDate = '2021-11-17'
  const businessDay = isBusinessDay(dummyDate)
  expect(businessDay).toBe(true)
})


test("Determine the string '2016-02-15' (Presidents Day) is not a business day", () => {
  const dummyDate = dayjs.tz('2016-02-15', "America/New_York")
  const businessDay = isBusinessDay(dummyDate)
  expect(businessDay).toBe(false)
})

test("Throw an error if input date is formatted as '27-12-2016' is provided", () => {
  const dummyDate = '27-12-2016'
  expect(
    () => {
    isBusinessDay(dummyDate)
  }).toThrow()
});

