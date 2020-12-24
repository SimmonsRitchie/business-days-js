# business-days-js

![npm](https://img.shields.io/npm/v/business-days-js)
![npm bundle size](https://img.shields.io/bundlephobia/min/business-days-js)

Determines whether a given date and time is on a weekend or a public holiday in the U.S. Can also add business days to a specified date to calculate a new date.

This package uses [dayjs](https://www.npmjs.com/package/dayjs) and [date-holidays](https://www.npmjs.com/package/date-holidays).

### Install

```
npm i business-days-js
```

### Usage

First inititalize a businessDays object:

```
import businessDays from "business-days-js";

const bDays = businessDays();
```
By default, businessDays treats 10 U.S. public holidays as non-business days. To use state-specific public holidays, instead initialize businessDays with an appropriate two-letter state abbreviation:

```
import businessDays from "business-days-js";

const bDays = businessDays("pa"); // uses public holidays for Pennsylvania
```
Consult 'advanced usage' for more information about customizing public holidays.

##### Check business day

To check whether a native Date object is a business day:

```
import businessDays from "business-days-js";

const bDays = businessDays("pa");
const presidentsDay = new Date("2016-02-15 00:00:00 GMT-0500"); // 12 a.m. on Feb. 15, 2016 (EST)
bDays.check(presidentsDay); // returns false

```
Dates can also be provided as a string formatted as "YYYY-MM-DD":

```
import businessDays from "business-days-js";

const bDays = businessDays("pa");
const bizDay = "2021-11-17"; // Wednesday, Nov 17, 2021
bDays.check(bizDay); // returns true
```

Or dates can be provided as a Day.js object:

```
import businessDays from "business-days-js";
import dayjs from "dayjs";

const bDays = businessDays("pa");
const xmasDay = dayjs("2020-12-25 00:00:00 GMT-0500"); // 12 a.m. on Dec 25, 2020 (EST)
bDays.check(xmasDay); // returns false
```

##### Add business days 

Add a specified number of business days to a date to calculate a new date. The returned date is a Day.js object.

```
import businessDays from "business-days-js";

const startDate = new Date("2020-12-20 00:00:00 GMT-0500");
bDays.addDays(startDate, 5) // returns a Day.js object representing Dec 28, 2020.
```

As with other methods, dates can be provided as a DayJS object or a string formatted as "YYYY-MM-DD":

```
import businessDays from "business-days-js";

const bDays = businessDays("pa");
const newDate = bDays.addDays("2020-12-20", 5) // returns a Day.js object representing Dec 28, 2020.
```

##### Count days

To return an object with a tally of total days, business days, weekends, weekdays, and holidays between two dates:

```
import businessDays from "business-days-js";

const bDays = businessDays("pa");
bDays.countDays("2020-12-20", "2020-12-28") // returns an object
```

Note that countDays excludes the start date from its calculations by default. For instance, by default countDays would count a total of eight days between "2020-12-20" to "2020-12-28" rather than nine days.

To include the start date in the tallies:

```
import businessDays from "business-days-js";

const bDays = businessDays("pa");
bDays.countDays("2020-12-20", "2020-12-28", {excludeInitialDate: false})
```

##### Get list of public holidays

To get a list of public holidays for a specific year:

```
import businessDays from "business-days-js";

const bDays = businessDays("pa");
bDays.getHolidays("2020")

```

### Advanced Usage

##### Customize public holidays

You can exclude specific public holidays from businessDays default list of public holidays. Simply initialize a businessDays object with a list of holidays to exclude.

```
import businessDays from "business-days-js";

const bDays = businessDays("pa", {excludeHolidays: ["Flag Day", "Presidents' Day"]});

// Flag Day and Presidents' Day will now be considered business days if they fall during the work week.
const flagDay = new Date("2019-06-14 00:00:00 GMT-0500")
const presDay = new Date("2020-02-17 00:00:00 GMT-0500")
bDays.check(flagDay) // returns true
bDays.check(presDay) // returns true
```

### Note about public holidays

By default, when inititalized without a state abbreviation, businessDays treats 10 U.S. public holidays as non-business days:

- New Year's Day
- Martin Luther King Jr. Day
- Washington's Birthday
- Memorial Day
- Independence Day
- Labor Day
- Columbus Day
- Veterans Day
- Thanksgiving Day
- Christmas Day

If those days fall on a weekend, subsitution days are used based on rules defined by [date-holidays](https://www.npmjs.com/package/date-holidays). For instance, if Christmas Day (Dec 25) falls on a Sunday, then Monday will be assumed to be a public holiday. If Christmas Day falls on a Saturday than Friday will be assumed to be a public holiday.

For more information about holiday rules, please consult the documentation for [date-holidays](https://www.npmjs.com/package/date-holidays).