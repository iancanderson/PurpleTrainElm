module Date.Extra.CoreTests exposing (..)

import Date exposing (Date)
import Test exposing (..)
import Expect
import Date.Extra.Core as Core
import Date.Extra.Create as Create
import Date.Extra.Utils as DateUtils
import TestUtils


tests : Test
tests =
  describe "Date.Core tests"
    [ test "Dummy passing test." (\() -> Expect.equal True True)

    , let
        nd3 = Core.nextDay << Core.nextDay << Core.nextDay
        nd7 = nd3 << nd3 << Core.nextDay
      in
        test "nextDay cycles through all days" <|
          \() -> Expect.equal Date.Mon (nd7 Date.Mon)

    , let
        pd3 = Core.prevDay << Core.prevDay << Core.prevDay
        pd7 = pd3 << pd3 << Core.prevDay
      in
        test "prevDay cycles through all days" <|
          \() -> Expect.equal Date.Mon (pd7 Date.Mon)

    , test "2016 is a leap year in length" <|
        \() -> Expect.equal 366 (Core.yearToDayLength 2016)

    , test "1900 is not a leap year in length" <|
        \() -> Expect.equal 365 (Core.yearToDayLength 1900)

    , test "2016 is a leap year" <|
        \() -> Expect.equal True (Core.isLeapYear 2016)

    , test "1900 is not a leap year" <|
        \() -> Expect.equal False (Core.isLeapYear 1900)

    , let
        nm3 = Core.nextMonth << Core.nextMonth << Core.nextMonth
        nm12 = nm3 << nm3 << nm3 << nm3
      in
        test "nextMonth cycles through all months" <|
          \() -> Expect.equal Date.Jan (nm12 Date.Jan)

    , let
        pm3 = Core.prevMonth << Core.prevMonth << Core.prevMonth
        pm12 = pm3 << pm3 << pm3 << pm3
      in
        test "prevMonth cycles through all months" <|
          \() -> Expect.equal Date.Jan (pm12 Date.Jan)

    , test "daysInprevMonth" <|
        \() -> Expect.equal 29
          (Core.daysInPrevMonth (Create.dateFromFields 2012 Date.Mar 04 11 34 0 0))

    , test "daysInNextMonth" <|
        \() -> Expect.equal 31
          (Core.daysInNextMonth (Create.dateFromFields 2011 Date.Dec 25 22 23 0 0))

    , test "toFirstOfMonth \"2015-11-11 11:45\" is \"2015-11-01 11:45\"" <|
        TestUtils.assertDateFunc
          "2015/11/11 11:45"
          "2015-11-01T11:45:00.000"
          Core.toFirstOfMonth

    , test "toFirstOfMonth \"2016-01-02 00:00\" is \"2016-01-01 00:00\"" <|
        TestUtils.assertDateFunc
          "2016/01/02"
          "2016-01-01T00:00:00.000"
          Core.toFirstOfMonth

    , test "toFirstOfMonth \"2016-01-02\" is \"2016-01-01\"" <|
        TestUtils.assertDateFunc
          "2016/01/02"
          "2016-01-01T00:00:00.000"
          Core.toFirstOfMonth

    , test "lastOfMonthDate" <|
        TestUtils.assertDateFunc
          "2015/11/11 11:45"
          "2015-11-30T11:45:00.000"
          Core.lastOfMonthDate

    , test "lastOfMonthDate Leap Year Feb" <|
        TestUtils.assertDateFunc
          "2012/02/18 11:45"
          "2012-02-29T11:45:00.000"
          Core.lastOfMonthDate

    , test "lastOfprevMonthDate" <|
        TestUtils.assertDateFunc
          "2012/03/02 11:45"
          "2012-02-29T11:45:00.000"
          Core.lastOfPrevMonthDate

    , test "firstOfNextMonthDate" <|
        TestUtils.assertDateFunc
          "2012/02/01 02:20"
          "2012-03-01T02:20:00.000"
          Core.firstOfNextMonthDate

    -- this is all the possible cases.
    , describe "DateUtils.daysBackToStartOfWeek tests" <|
        List.map
          runBackToStartofWeekTests
            [ (Date.Mon, Date.Mon, 0)
            , (Date.Mon, Date.Tue, 6)
            , (Date.Mon, Date.Wed, 5)
            , (Date.Mon, Date.Thu, 4)
            , (Date.Mon, Date.Fri, 3)
            , (Date.Mon, Date.Sat, 2)
            , (Date.Mon, Date.Sun, 1)

            , (Date.Tue, Date.Mon, 1)
            , (Date.Tue, Date.Tue, 0)
            , (Date.Tue, Date.Wed, 6)
            , (Date.Tue, Date.Thu, 5)
            , (Date.Tue, Date.Fri, 4)
            , (Date.Tue, Date.Sat, 3)
            , (Date.Tue, Date.Sun, 2)

            , (Date.Wed, Date.Mon, 2)
            , (Date.Wed, Date.Tue, 1)
            , (Date.Wed, Date.Wed, 0)
            , (Date.Wed, Date.Thu, 6)
            , (Date.Wed, Date.Fri, 5)
            , (Date.Wed, Date.Sat, 4)
            , (Date.Wed, Date.Sun, 3)

            , (Date.Thu, Date.Mon, 3)
            , (Date.Thu, Date.Tue, 2)
            , (Date.Thu, Date.Wed, 1)
            , (Date.Thu, Date.Thu, 0)
            , (Date.Thu, Date.Fri, 6)
            , (Date.Thu, Date.Sat, 5)
            , (Date.Thu, Date.Sun, 4)

            , (Date.Fri, Date.Mon, 4)
            , (Date.Fri, Date.Tue, 3)
            , (Date.Fri, Date.Wed, 2)
            , (Date.Fri, Date.Thu, 1)
            , (Date.Fri, Date.Fri, 0)
            , (Date.Fri, Date.Sat, 6)
            , (Date.Fri, Date.Sun, 5)

            , (Date.Sat, Date.Mon, 5)
            , (Date.Sat, Date.Tue, 4)
            , (Date.Sat, Date.Wed, 3)
            , (Date.Sat, Date.Thu, 2)
            , (Date.Sat, Date.Fri, 1)
            , (Date.Sat, Date.Sat, 0)
            , (Date.Sat, Date.Sun, 6)

            , (Date.Sun, Date.Mon, 6)
            , (Date.Sun, Date.Tue, 5)
            , (Date.Sun, Date.Wed, 4)
            , (Date.Sun, Date.Thu, 3)
            , (Date.Sun, Date.Fri, 2)
            , (Date.Sun, Date.Sat, 1)
            , (Date.Sun, Date.Sun, 0)
            ]
    ]


runBackToStartofWeekTests : (Date.Day, Date.Day, Int) -> Test
runBackToStartofWeekTests (dateDay, startOfWeekDay, expectedOffset) =
  test
    (  "dateDay " ++ (toString dateDay)
    ++ " for startOfWeekDay " ++ (toString startOfWeekDay)
    ++ " expects Offsetback of " ++ (toString expectedOffset) ) <|
  \() -> Expect.equal
    (expectedOffset)
    (Core.daysBackToStartOfWeek dateDay startOfWeekDay)
