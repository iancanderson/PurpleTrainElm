module Date.Extra.UtilsTests exposing (..)

{- Copyright (c) 2016 Robin Luiten -}

import Date exposing (Date)
import Test exposing (..)
import Expect
import Time exposing (Time)

import Date.Extra.Config.Config_en_au as Config_en_au
import Date.Extra.Core as Core
import Date.Extra.Create as Create
import Date.Extra.Format as Format
import Date.Extra.Utils as DateUtils
import TestUtils

config_en_au = Config_en_au.config


tests : Test
tests =
  describe "Date.Utils tests"
    [ test "Dummy passing test." (\() -> Expect.equal True True)

    , let
        resultList =
          DateUtils.dayList 35 (Create.dateFromFields 2015 Date.Dec 28 0 0 0 0)
        -- _ = Debug.log("dayListTest resultList") List.map Format.isoString resultList
        resultListDays = List.map Date.day resultList
      in
        test "Test 2016 Jan calendar grid date list." <|
          \() -> Expect.equal ((List.range 28 31) ++ (List.range 1 31)) resultListDays

    , describe "isoWeekOne tests" <|
        List.map runIsoWeekOneTest
          [ (2005, "2005-01-03T00:00:00.000")
          , (2006, "2006-01-02T00:00:00.000")
          , (2007, "2007-01-01T00:00:00.000")
          , (2008, "2007-12-31T00:00:00.000")
          , (2009, "2008-12-29T00:00:00.000")
          , (2010, "2010-01-04T00:00:00.000")
          ]

    , describe "isoWeek tests" <|
        List.map runIsoWeekTest
          [ ("2005/Jan/01", 2004, 53, 6)
          , ("2005/Jan/02", 2004, 53, 7)
          , ("2005/Jan/03", 2005,  1, 1)
          , ("2007/Jan/01", 2007,  1, 1)
          , ("2007/Dec/30", 2007, 52, 7)
          , ("2010/Jan/03", 2009, 53, 7)
          ]
    ]


runIsoWeekOneTest (year, expectedDateStr) =
  test ("isoWeekOne of year " ++ (toString year)) <|
    \() -> Expect.equal
      (expectedDateStr)
      (Format.isoStringNoOffset (DateUtils.isoWeekOne year))


runIsoWeekTest (dateStr, expectedYear, expectedWeek, expectedIsoDay) =
  test ("isoWeek of " ++ dateStr) <|
    \() -> Expect.equal
      (expectedYear, expectedWeek, expectedIsoDay)
      (DateUtils.isoWeek (DateUtils.unsafeFromString(dateStr)))
