## business-days-js

Determines whether a given date is on a weekend or a public holiday in Pennsylvania.

### Install

```
npm i business-days-js

```

### Usage

Check whether a date is a business day using a dayjs instance or a string formatted as 'YYYY-MM-DD
:

```
const {isBusinessDay} = require("../index")
dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

// return false (not a business day)
const xmasDay = dayjs.tz('2016-12-25', "America/New_York");
const businessDay = isBusinessDay(xmasDay);

// return false (not a business day)
const presidentsDay = '2016-12-25';
const businessDay = isBusinessDay(presidentsDay);

// return false ( =business day)


```

Check whether a data is a business day using a string formatted as '1