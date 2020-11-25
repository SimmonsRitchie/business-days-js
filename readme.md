# business-days-js

![npm](https://img.shields.io/npm/v/business-days-js)
![npm bundle size](https://img.shields.io/bundlephobia/min/business-days-js)

Determines whether a given date is on a weekend or a public holiday in Pennsylvania. Uses [dayjs](https://www.npmjs.com/package/dayjs) and [date-holidays](https://www.npmjs.com/package/date-holidays).

### Install

```
npm i business-days-js

```

### Usage

Inititalize a new businessDays object with a provided U.S. state in two letter format.

```
import businessDays from "business-days-js";
const bDays = businessDays("pa");

```

Check whether a date is a business day. Works with native Date object, dayjs instance, or a string formatted as 'YYYY-MM-DD'.

```
import businessDays from "business-days-js";
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const bDays = businessDays("pa");

const xmasDay = dayjs.tz('2016-12-25', "America/New_York");
bDays.check(xmasDay); // return false

const presidentsDay = '2016-12-25';
bDays.check(presidentsDay); // return false

const bizDay = '2021-11-17';
bDays.check(bizDay); // return true

```

