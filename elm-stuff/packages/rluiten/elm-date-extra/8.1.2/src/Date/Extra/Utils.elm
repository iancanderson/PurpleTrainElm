module Date.Extra.Utils exposing
  ( unsafeFromString
  , dayList
  , isoWeek
  , isoWeekOne
  )

{-| Date Utils.

2016/14/23 `fromString` was removed as its extra date validity checking had problems in
many timezones so it became the same as `Date.fromString`.

## Date parsing
**Be careful with unsafeFromString it will Debug.crash() if it cant parse date.**
@docs unsafeFromString

## Utility
@docs dayList
@docs isoWeek
@docs isoWeekOne

Copyright (c) 2016 Robin Luiten
-}

import Date exposing (Day (..), Date, Month (..))
import Regex
import String
import Time

import Date.Extra.Core as Core
import Date.Extra.Create as Create
import Date.Extra.Period as Period
import Date.Extra.TimeUnit as TimeUnit
import Date.Extra.Format as Format
import Date.Extra.Compare as Compare exposing (is, Compare2 (..))


{-| Return a list of days dayLength long for successive days
starting from startDate.
-}
dayList : Int -> Date -> List (Date)
dayList dayLength startDate =
  List.reverse (dayList_ dayLength startDate [])


dayList_ : Int -> Date -> List (Date) -> List (Date)
dayList_ dayLength date list =
  if dayLength == 0 then
    list
  else
    dayList_
      (dayLength - 1)
      -- (addDays 1 date)
      (Period.add Period.Day 1 date)
      (date :: list)


{-| Return iso week values year, week, isoDayOfWeek.
Input date is expected to be in local time zone of vm.
-}
isoWeek : Date -> (Int, Int, Int)
isoWeek date =
  let
    inputYear = Date.year date
    endOfYearMaxIsoWeekDate = Create.dateFromFields inputYear Date.Dec 29 0 0 0 0
    (year, week1) =
      if is SameOrAfter date endOfYearMaxIsoWeekDate then
        let
          nextYearIsoWeek1 = isoWeekOne (inputYear + 1)
          -- _ = Debug.log("isoWeek") ("nextYearIsoWeek1", inputYear + 1, Format.isoString nextYearIsoWeek1)
        in
          if is Before date nextYearIsoWeek1 then
            (inputYear, isoWeekOne inputYear)
          else
            (inputYear + 1, nextYearIsoWeek1)
      else
        let
          thisYearIsoWeek1 = isoWeekOne inputYear
          -- _ = Debug.log("isoWeek") ("thisYearIsoWeek1", inputYear, Format.utcFormat.isoString thisYearIsoWeek1)
        in
          if is Before date thisYearIsoWeek1 then
            (inputYear - 1, isoWeekOne (inputYear - 1))
          else
            (inputYear, thisYearIsoWeek1)
    dateAsDay = TimeUnit.startOfTime TimeUnit.Day date
    daysSinceWeek1 = (Core.toTime dateAsDay - (Core.toTime week1)) // Core.ticksADay
  in
    (year, (daysSinceWeek1 // 7) + 1, Core.isoDayOfWeek (Date.dayOfWeek date))


{- Reference point for isoWeekOne. -}
isoDayofWeekMonday = Core.isoDayOfWeek Date.Mon


{-| Return date of start of ISO week one for given year. -}
isoWeekOne : Int -> Date
isoWeekOne year =
  let
    date = Create.dateFromFields year Jan 4 0 0 0 0
    isoDow = Core.isoDayOfWeek (Date.dayOfWeek date)
  in
    Period.add Period.Day (isoDayofWeekMonday - isoDow) date


{-| Utility for known input string date creation cases.
Checks for a fail just in case and calls Debug.crash().
-}
unsafeFromString : String -> Date
unsafeFromString dateStr =
  case Date.fromString dateStr of
    Ok date -> date
    Err msg -> Debug.crash("unsafeFromString")
