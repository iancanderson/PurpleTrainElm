module Date.Extra.Duration exposing
  ( add
  , Duration (..)
  , DeltaRecord
  , zeroDelta
  , diff
  )

{-| A Duration is a length of time that may vary with with calendar date
and time. It can be used to modify a date.

When modify dates using Durations (Day | Month | Week | Year) this module
compensates for day light saving hour variations to minimise the scenarios
that cause the Hour field in the result to be different to the input date.
It can't completely avoid the hour changing as some hours are not a real
world date and hence will modify the hour more than the Duration modified.

This behaviour is modelled on momentjs so any observed behaviour that is
not the same as momentjs should be raised as in issue.

Note adding or subtracting 24 * Hour units from a date may produce a
different answer to adding or subtracting a Day if day light saving
transitions occur as part of the date change.

**Warning**

Be careful if you add Duration Delta to a Date as Duration contains months
and Years which are not fixed elapsed times like Period Delta, however if
you really need a relative number of months or years then it may meet
your needs.

@docs add
@docs Duration
@docs DeltaRecord
@docs zeroDelta
@docs diff

Copyright (c) 2016 Robin Luiten
-}

import Date exposing (Date, Month)

-- import Date.Extra.Calendar as Calendar
import Date.Extra.Compare as Compare
import Date.Extra.Core as Core
import Date.Extra.Create as Create
import Date.Extra.Format as Format
import Date.Extra.Internal as Internal
import Date.Extra.Period as Period


{-| A Duration is time period that may vary with with calendar and time.

Using `Duration` adding 24 hours can produce different result to adding 1 day.

-}
type Duration
  = Millisecond
  | Second
  | Minute
  | Hour
  | Day
  | Week
  | Month
  | Year
  | Delta DeltaRecord

{-| A multi granularity duration delta.

This does not contain week like Period.DeltaRecord.
It does contain month and year.
-}
type alias DeltaRecord =
  { year : Int
  , month : Int
  , day : Int
  , hour : Int
  , minute : Int
  , second : Int
  , millisecond : Int
  }


{-| All zero delta.
Useful as a starting point if you want to set a few fields only.
-}
zeroDelta : DeltaRecord
zeroDelta =
  { year = 0
  , month = 0
  , day = 0
  , hour = 0
  , minute = 0
  , second = 0
  , millisecond = 0
  }

{- Return true if this Duration unit compensates for crossing daylight saving
boundaries.
TODO this may need to compensate for day light saving for all fields as all of them
can cause the date to change the zone offset.
-}
requireDaylightCompensateInAdd : Duration -> Bool
requireDaylightCompensateInAdd duration =
  case duration of
    Millisecond -> False
    Second -> False
    Minute -> False
    Hour -> False
    Day -> True
    Week -> True
    Month -> True
    Year -> True
    --  If day,month,year is non zero in Delta then compensate.
    Delta delta -> delta.day /= 0 || delta.month /= 0 || delta.year /= 0


{-| Add duration * count to date. -}
add : Duration -> Int -> Date -> Date
add duration addend date =
  let
    -- _ = Debug.log "add" (duration, addend)
    outputDate = doAdd duration addend date
  in
    if requireDaylightCompensateInAdd duration then
      daylightOffsetCompensate date outputDate
    else
      outputDate


doAdd : Duration -> Int -> Date -> Date
doAdd duration addend date =
  case duration of
    Millisecond -> Period.add Period.Millisecond addend date
    Second -> Period.add Period.Second addend date
    Minute -> Period.add Period.Minute addend date
    Hour -> Period.add Period.Hour addend date
    Day -> Period.add Period.Day addend date
    Week -> Period.add Period.Week addend date
    Month -> addMonth addend date
    Year -> addYear addend date
    Delta delta ->
      doAdd Year delta.year date
        |>  doAdd Month delta.month
        |>  Period.add
              ( Period.Delta
                  { week = 0
                  , day = delta.day
                  , hour = delta.hour
                  , minute = delta.minute
                  , second = delta.second
                  , millisecond = delta.millisecond
                  }
              )
              addend


daylightOffsetCompensate : Date -> Date -> Date
daylightOffsetCompensate dateBefore dateAfter =
  let
    offsetBefore = Create.getTimezoneOffset dateBefore
    offsetAfter = Create.getTimezoneOffset dateAfter
    -- _ = Debug.log "daylightOffsetCompensate"
    --   (offsetBefore, offsetAfter, (offsetAfter - offsetBefore)
    --   , Format.isoString dateAfter
    --   , Format.isoString
    --     ( Period.add
    --         Period.Millisecond
    --         ((offsetAfter - offsetBefore) * Core.ticksAMinute) dateAfter
    --     )
    --   )
  in
    -- this 'fix' can only happen if the date isnt allready shifted ?
    if offsetBefore /= offsetAfter then
      let
        adjustedDate =
          Period.add
            Period.Millisecond
            ((offsetAfter - offsetBefore) * Core.ticksAMinute) dateAfter
        adjustedOffset = Create.getTimezoneOffset adjustedDate
      in
        -- our timezone difference compensation caused us to leave the
        -- the after time zone this indicates we are falling in a place
        -- that is shifted by daylight saving so do not compensate
        if adjustedOffset /= offsetAfter then
          dateAfter
        else
          adjustedDate
    else
      dateAfter


{- Return a date with month count added to date.

New version leveraging daysFromCivil does not loop
over months so faster and only compensates at outer
level for DST.

Expects input in local time zone.
Return is in local time zone.
-}
addMonth : Int -> Date -> Date
addMonth monthCount date =
  let
    year = Date.year date
    monthInt = Core.monthToInt (Date.month date)
    day = Date.day date
    inputCivil = Internal.daysFromCivil year monthInt day
    newMonthInt = monthInt + monthCount
    targetMonthInt = newMonthInt % 12
    yearOffset =
      if newMonthInt < 0 then
        (newMonthInt // 12) - 1 -- one extra year than the negative modulus
      else
        newMonthInt // 12
    newYear = year + yearOffset
    newDay = min (Core.daysInMonth newYear (Core.intToMonth newMonthInt)) day
    -- _ = Debug.log "addMonth a" ((year, monthInt, day)
    --     , "yearOffset", yearOffset, newMonthInt
    --     , "a", (newYear, targetMonthInt, newDay))
    newCivil = Internal.daysFromCivil newYear targetMonthInt newDay
    daysDifferent = newCivil - inputCivil
    -- _ = Debug.log "addMonth b" (newCivil, inputCivil, newCivil - inputCivil)
  in
    Period.add Period.Day daysDifferent date


{- Return a date with year count added to date.
-}
addYear : Int -> Date -> Date
addYear yearCount date  =
  addMonth (12 * yearCount) date


{-| Return a Period representing date difference. date1 - date2.

If  you add the result of this function to date2 with addend of 1
will return date1.

**Differences to Period.diff**

* Duration DeltaRecord excludes week field
* Duration DeltaRecord includes month field
* Duration DeltaRecord includes year field
* Day is number of days difference between months.

When adding a Duration DeltaRecord to a date.
The larger granularity fields are added before lower granularity fields
so Years are added before Months before Days etc.

* Very different behaviour to Period diff
 * If date1 > date2 then all fields in DeltaRecord will be positive or zero.
 * If date1 < date2 then all fields in DeltaRecord will be negative or zero.
* Because it deals with non fixed length periods of time

Example 1.
  days in 2016/05 (May) = 31
  days in 2016/04 (Apr) = 30
  days in 2016/03 (Mar) = 31

  days in 2015/03 (Mar) = 31

  diff of "2016/05/15" "2015/03/20"
  result naive field diff.
    year 1, month 2, day -5

  days "2015/03/20" to "2015/04/01" (31 - 20) = 11 days (12). still in march with 11.
  days "2015/04/01" to "2016/04/15" (15 - 1) = 14 days
  months "2016/04/15" to "2016/05/15" 1 months
  result field diff
    year 1, month 1, day 26

  This logic applies all the way down to milliseconds.



 -}
diff : Date -> Date -> DeltaRecord
diff date1 date2 =
  if Compare.is Compare.After date1 date2 then
    positiveDiff date1 date2 1
  else
    positiveDiff date2 date1 -1


{-| Return diff between dates. date1 - date.

Precondition for this function is date1 must be after date2.
Input mult is used to multiply output fields as needed for caller,
this is used to conditionally negate them in initial use case.
-}
positiveDiff : Date -> Date -> Int -> DeltaRecord
positiveDiff date1 date2 mult =
  let
    year1 = Date.year date1
    year2 = Date.year date2
    month1Mon = Date.month date1
    month2Mon = Date.month date2
    month1 = Core.monthToInt month1Mon
    month2 = Core.monthToInt month2Mon
    day1 = Date.day date1
    day2 = Date.day date2
    hour1 = Date.hour date1
    hour2 = Date.hour date2
    minute1 = Date.minute date1
    minute2 = Date.minute date2
    second1 = Date.second date1
    second2 = Date.second date2
    msec1 = Date.millisecond date1
    msec2 = Date.millisecond date2
    -- _ = Debug.log "diff>>" ((year2, year1), (month1, month2), (day1, day2))

    -- Accumlated diff
    accDiff acc v1 v2 maxV2 =
      if v1 < v2 then
        (acc - 1, maxV2 + v1 - v2)
      else
        (acc, v1 - v2)

    daysInDate2Month = Core.daysInMonth year2 month2Mon
    -- _ = Debug.log "daysInDate2Month" (year2, month2Mon, daysInDate2Month)
    (yearDiff, monthDiffA) = accDiff (year1 - year2) month1 month2 12
    -- _ = Debug.log "diff year:" ((year1 - year2), yearDiff)
    (monthDiff, dayDiffA) = accDiff monthDiffA day1 day2 daysInDate2Month
    -- _ = Debug.log "diff month:" (monthDiffA, monthDiff, (daysInDate2Month))
    (dayDiff, hourDiffA) = accDiff dayDiffA hour1 hour2 24
    -- _ = Debug.log "diff month:" (dayDiffA, dayDiff)
    (hourDiff, minuteDiffA) = accDiff hourDiffA minute1 minute2 60
    (minuteDiff, secondDiffA) = accDiff minuteDiffA second1 second2 60
    (secondDiff, msecDiff) = accDiff secondDiffA msec1 msec2 1000
  in
    { year = yearDiff * mult
    , month = monthDiff * mult
    , day = dayDiff * mult
    , hour = hourDiff * mult
    , minute = minuteDiff * mult
    , second = secondDiff * mult
    , millisecond = msecDiff * mult
    }
