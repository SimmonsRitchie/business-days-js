# business-days-js

![npm](https://img.shields.io/npm/v/business-days-js)
![npm bundle size](https://img.shields.io/bundlephobia/min/business-days-js)

Determines whether a given date is on a weekend or a public holiday in the U.S. Uses [dayjs](https://www.npmjs.com/package/dayjs) and [date-holidays](https://www.npmjs.com/package/date-holidays).

### Install

```
npm i business-days-js
```

### Usage

Inititalize businessDays object with a U.S. state in two-letter format.

```
import businessDays from "business-days-js";

const bDays = businessDays("pa");
```

Check whether a date is a business day. Works with native Date object, dayjs instance, or a string formatted as 'YYYY-MM-DD'.

```
import businessDays from "business-days-js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const bDays = businessDays("pa");

const xmasDay = dayjs.tz("2016-12-25", "America/New_York");
console.log(bDays.check(xmasDay)); // returns false

const presidentsDay = new Date("2016-02-15 00:00:00 GMT-0500");
console.log(bDays.check(presidentsDay)); // returns false

const bizDay = "2021-11-17";
console.log(bDays.check(bizDay)); // returns true
```

