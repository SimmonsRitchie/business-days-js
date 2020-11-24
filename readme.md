# business-days-js

![npm](https://img.shields.io/npm/v/business-days-js)
![npm bundle size](https://img.shields.io/bundlephobia/min/business-days-js)

Determines whether a given date is on a weekend or a public holiday in Pennsylvania. Uses [dayjs](https://www.npmjs.com/package/dayjs) and [date-holidays](https://www.npmjs.com/package/date-holidays).

### Install

```
npm i business-days-js

```

### Usage

isBusinessDay returns true if a provided date is on a business day in Pennsylvania, defined any day that is not a weekend or public holiday.

Provided date can be a dayjs instance or a string formatted as 'YYYY-MM-DD'.

```
const { isBusinessDay } = require("src/index")
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const xmasDay = dayjs.tz('2016-12-25', "America/New_York");
isBusinessDay(xmasDay); // return false

const presidentsDay = '2016-12-25';
isBusinessDay(presidentsDay); // return false

const bizDay = '2021-11-17';
isBusinessDay(bizDay); // return true

```

