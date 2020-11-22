## Business Days JS

Determines whether a given date is on a weekend or a public holiday in Pennsylvania.

### Install

```
npm install business-days-js

```

### Usage

Check whether a date is a business day using a dayjs instance:

```
const {isBusinessDay} = require("../index")
dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const xmasDay = dayjs.tz('2016-12-25', "America/New_York")
const businessDay = isBusinessDay(dummyDate)
```