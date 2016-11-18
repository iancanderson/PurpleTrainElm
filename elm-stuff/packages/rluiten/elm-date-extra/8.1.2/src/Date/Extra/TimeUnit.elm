module Date.Extra.TimeUnit exposing
  ( startOfTime
  , endOfTime
  , TimeUnit (..)
  )

{-| Reduce or Increase a date to a given start or end of a TimeUnit granularity.

This allows you to modify a date to reset to minimum or maximum values
all values below a given TimeUnit granulariy.

This operates in local time zone so if you are not in UTC time zone
and you output date in UTC time zone the datefields will not be to the start
or end of the TimeUnit.

Example `TimeUnit.startOfTime Hour date` will return a modified date with
* Minutes to 0
* Seconds to 0
* Milliseconds to 0

Example `TimeUnit.endOfTime Hour date` will return a modified date with
* Minutes to 59
* Seconds to 59
* Milliseconds to 999


@docs startOfTime
@docs endOfTime
@docs TimeUnit

**Warning about using endOfTime for date ranges**

In the past when I have encountered people using a function like endOfTime
(max date at a given granularity) it was being used in ways that could introduce
problems.

Here is why.

* You want to do a date range comparison between the minimum date
(or current date) and this maximum date. In all the cases I can
remember they were doing a date range comparison using
Greater Than Or Equal To minimum date and Less Than or Equal To maximum date.
 * I can't state strongly enough that this is not the way to do date ranges
 it leads to missed matches that fall between the generated maximum date
 and the following date at the same granularity in systems were you are
 working at a granularity larger than the underlying stored granularity.
 Even if you are working at the smallest granularity of the system its a
 not a good way to think about ranges.
 * When comparing date ranges I strongly suggest you always use a
 half closed interval. This means always build date ranges using
 Greater Than or Equal To minimum date and Less Than maximum date.
 (This applies to floating point numbers as well).
  * Its equivalently safe to go Greater Than minimum and
  Less Than or Equal to maximum, in my experience business understanding
  nearly always dictated include minimum excluded maximum.
 * Once you do this there is no possible gap and it becomes easier to think about.

Copyright (c) 2016 Robin Luiten
-}

import Date exposing (Date, Month (..))

import Date.Extra.Core as Core
import Date.Extra.Field as Field
import Date.Extra.Duration as Duration


{-| Date granularity of operations. -}
type TimeUnit
  = Millisecond
  | Second
  | Minute
  | Hour
  | Day
  | Month
  | Year


{-| Return a date created by reducing to minimum value all values below
a given TimeUnit granularity.

This modifies date in local time zone values, as the date element parts
are pulled straight from the local time zone date values.
-}
startOfTime : TimeUnit -> Date -> Date
startOfTime unit date =
  case unit of
    Millisecond -> date
    Second -> Field.fieldToDateClamp (Field.Millisecond 0) date
    Minute -> Field.fieldToDateClamp (Field.Second 0) (startOfTime Second date)
    Hour -> Field.fieldToDateClamp (Field.Minute 0) (startOfTime Minute date)
    Day -> Field.fieldToDateClamp (Field.Hour 0) (startOfTime Hour date)
    Month -> Field.fieldToDateClamp (Field.DayOfMonth 1) (startOfTime Day date)
    Year -> startOfTimeYear date


startOfTimeYear : Date -> Date
startOfTimeYear date =
  let
    startMonthDate = Field.fieldToDateClamp (Field.DayOfMonth 1) date
    startYearDate = Field.fieldToDateClamp (Field.Month Jan) startMonthDate
    monthTicks = (Core.toTime startMonthDate) - (Core.toTime startYearDate)
    updatedDate = Core.fromTime ((Core.toTime date) - monthTicks)
  in
    startOfTime Month updatedDate


{-| Return a date created by increasing to maximum value all values below
a given TimeUnit granularity.

This modifies in local time zone values, as the date element parts
are pulled straight from the local time zone date values.
-}
endOfTime : TimeUnit -> Date -> Date
endOfTime unit date =
  case unit of
    Millisecond -> date
    Second -> Field.fieldToDateClamp (Field.Millisecond 999) date
    Minute -> Field.fieldToDateClamp (Field.Second 59) (endOfTime Second date)
    Hour -> Field.fieldToDateClamp (Field.Minute 59) (endOfTime Minute date)
    Day -> Field.fieldToDateClamp (Field.Hour 23) (endOfTime Hour date)
    Month -> Field.fieldToDateClamp (Field.DayOfMonth 31) (endOfTime Day date)
    Year ->
      let
        extraYear = (Duration.add Duration.Year 1 date)
        startYear = startOfTime Year extraYear
      in
        Duration.add Duration.Millisecond -1 startYear
