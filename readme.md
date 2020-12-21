# business-days-js

![npm](https://img.shields.io/npm/v/business-days-js)
![npm bundle size](https://img.shields.io/bundlephobia/min/business-days-js)

Determines whether a given date is on a weekend or a public holiday in the U.S. This package can also add business days to a given date to calculate a new date.

This package uses [dayjs](https://www.npmjs.com/package/dayjs) and [date-holidays](https://www.npmjs.com/package/date-holidays).

### Install

```
npm i business-days-js
```

### Usage

First inititalize businessDays object with a U.S. state in two-letter format:

```
import businessDays from "business-days-js";

const bDays = businessDays("pa");
```

##### Check business day

To check whether a native Date object is a business day:

```
import businessDays from "business-days-js";

const bDays = businessDays("pa");
const presidentsDay = new Date("2016-02-15 00:00:00 GMT-0500");
bDays.check(presidentsDay); // returns false

```
Dates can also be provided as a string formatted as "YYYY-MM-DD":

```
import businessDays from "business-days-js";

const bDays = businessDays("pa");
const bizDay = "2021-11-17";
bDays.check(bizDay); // returns true
```

Or dates can be provided as a DayJS object:

```
import businessDays from "business-days-js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const bDays = businessDays("pa");
const xmasDay = dayjs.tz("2016-12-25", "America/New_York");
bDays.check(xmasDay); // returns false
```

##### Add business days 

Add a specified number of business days to a date to calculate a new date. The returned date is a DayJS object.

```
import businessDays from "business-days-js";

const startDate = new Date("2020-12-20 00:00:00 GMT-0500");
bDays.addDays(startDate, 5) // returns a DayJS object representing Dec 28, 2020.
```

As with other methods, dates can be provided as a DayJS object or a string formatted as "YYYY-MM-DD":

```
import businessDays from "business-days-js";

const bDays = businessDays("pa");
const newDate = bDays.addDays("2020-12-20", 5) // returns a DayJS object representing Dec 28, 2020.
```

##### Count days

To return an object representing tallies of the number of days, business days, weekends, weekdays, and holidays between two dates:

```
import businessDays from "business-days-js";

const bDays = businessDays("pa");
bDays.countDays("2020-12-20", "2020-12-28") // returns an object with props representing a count of
```

Note that countDays excludes the start date from its calculations by default. For instance, by default countDays would count a total of eight days between "2020-12-20" to "2020-12-28" rather than nine days.

To include the start date in the tallies:

```
import businessDays from "business-days-js";

const bDays = businessDays("pa");
bDays.countDays("2020-12-20", "2020-12-28", {excludeInitialDate: false}) // includes 2020-12-20 in computed tallies
```