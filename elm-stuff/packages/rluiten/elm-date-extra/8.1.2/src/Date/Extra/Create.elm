module Date.Extra.Create exposing
  ( getTimezoneOffset
  , dateFromFields
  , timeFromFields
  )

{-| Create dates and offsets.

@docs getTimezoneOffset
@docs dateFromFields
@docs timeFromFields

Copyright (c) 2016 Robin Luiten
-}

import Date exposing (Date, Month (..))

import Date.Extra.Core as Core
import Date.Extra.Internal as Internal
import Date.Extra.Period as Period


{-| Return the time zone offset of current javascript environment underneath
Elm in Minutes. This should produce the same result getTimezoneOffset()
for a given date in the same javascript VM.

Time zone offset is always for a given date and time so an input date is required.

Given that timezones change (though slowly) this is not strictly pure, but
I suspect it is sufficiently pure to be useful. Is is dependent on the timezone
mechanics of the javascript VM.

### Example zone stuff.
For an offset of -600 minutes, in +10:00 time zone offset.
-}
getTimezoneOffset : Date -> Int
getTimezoneOffset = Internal.getTimezoneOffset


{- Reference date used by dateFromFields. -}
epochDate = Date.fromTime 0


{- The TimezoneOffset of epochDate in current vm.
Return is negated to match sign of getTimeZoneOffsset

Y/M/D comes out 1969-12-31. The date time zone offset is negative hours minutes
Y/M/D comes out 1970-01-01. The date time offset is positive hours minutes

-}
epochTimezoneOffset =
  let
    inMinutes = (Date.hour epochDate * 60) + Date.minute epochDate
  in
    if ((Date.year epochDate) == 1969) then
      -(inMinutes - (24*60))
    else
      -inMinutes


{-| Create a date in current time zone from given fields.
All field values are clamped to there allowed range values.
Hours are input in 24 hour time range 0 to 23 valid.
Returns dates in current time zone.

Using algorithm from http://howardhinnant.github.io/date_algorithms.html
Specifically days_from_civil function.

The two `<*>Compensate` values adjust for the zone offset time
introduced by `epochDate` as starting point.
-}
dateFromFields : Int -> Month -> Int -> Int -> Int -> Int -> Int -> Date
dateFromFields year month day hour minute second millisecond =
  adjustedTicksToDate
    (Internal.ticksFromFields year month day hour minute second millisecond)


{-
This now compensates for current timezone offset compared to epoch offset.
In relation to #17.
-}
adjustedTicksToDate : Int -> Date
adjustedTicksToDate ticks =
  let
    date =
      Period.add
        Period.Millisecond
        (ticks + (epochTimezoneOffset * Core.ticksAMinute))
        epochDate
    dateOffset = getTimezoneOffset date
  in
    if dateOffset == epochTimezoneOffset then
      date
    else
      Period.add
        Period.Minute
        (dateOffset - epochTimezoneOffset)
        date


{-| Create a time in current time zone from given fields, for
when you dont care about the date part but need time part anyway.

All field values are clamped to there allowed range values.
This can only return dates in current time zone.

Hours are input in 24 hour time range 0 to 23 valid.

This defaults to year 1970, month Jan, day of month 1 for date part.
-}
timeFromFields : Int -> Int -> Int -> Int -> Date
timeFromFields =
  dateFromFields 1970 Jan 1


{- Timezone fun in Javascript

http://codeofmatt.com/2015/06/17/javascript-date-parsing-changes-in-es6/
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#Differences_in_assumed_time_zone

Some examples of behaviour.

Run this in js environment
  console.log(new Date("2015/06/17 00:00:00"))
  console.log(new Date("2015-06-17T00:00:00Z"))
  console.log(new Date("2015-06-17T00:00:00"))
  console.log(new Date("2015-06-17"))

Chrome 50 output in Newfoundland timezone
Wed Jun 17 2015 00:00:00 GMT-0230 (Local Daylight Time)
Tue Jun 16 2015 21:30:00 GMT-0230 (Local Daylight Time)
Tue Jun 16 2015 21:30:00 GMT-0230 (Local Daylight Time)
Tue Jun 16 2015 21:30:00 GMT-0230 (Local Daylight Time)

Firefox 45 output in Brisbane UTC+10:00
Date {Wed Jun 17 2015 00:00:00 GMT+1000 (E. Australia Standard Time)}
Date {Wed Jun 17 2015 10:00:00 GMT+1000 (E. Australia Standard Time)}
Date {Wed Jun 17 2015 00:00:00 GMT+1000 (E. Australia Standard Time)}
Date {Wed Jun 17 2015 10:00:00 GMT+1000 (E. Australia Standard Time)}

IE 11  output in Brisbane UTC+10:00
Wed Jun 17 2015 00:00:00 GMT+1000 (E. Australia Standard Time)
Wed Jun 17 2015 10:00:00 GMT+1000 (E. Australia Standard Time)
Wed Jun 17 2015 00:00:00 GMT+1000 (E. Australia Standard Time)
Wed Jun 17 2015 10:00:00 GMT+1000 (E. Australia Standard Time)

Node JS v5.3.0
Wed Jun 17 2015 00:00:00 GMT+1000 (E. Australia Standard Time)
Wed Jun 17 2015 10:00:00 GMT+1000 (E. Australia Standard Time)
Wed Jun 17 2015 10:00:00 GMT+1000 (E. Australia Standard Time)
Wed Jun 17 2015 10:00:00 GMT+1000 (E. Australia Standard Time)

Safari Version 9.1 (11601.5.17.1)
[Log] Wed Jun 17 2015 00:00:00 GMT-0700 (PDT)
[Log] Tue Jun 16 2015 17:00:00 GMT-0700 (PDT)
[Log] Tue Jun 16 2015 17:00:00 GMT-0700 (PDT)
[Log] Tue Jun 16 2015 17:00:00 GMT-0700 (PDT)

Safari Version 6.1.6  OsX 10.7.5
[Log] Wed Jun 17 2015 00:00:00 GMT-0500 (CDT)
[Log] Tue Jun 16 2015 19:00:00 GMT-0500 (CDT)
[Log] Tue Jun 16 2015 19:00:00 GMT-0500 (CDT)

-}
