module Date.Extra.DurationTests exposing (..)

import Date exposing (Date)
import Test exposing (..)
import Expect
import Time exposing (Time)

import Date.Extra.Create as Create
import Date.Extra.Duration as Duration exposing (Duration (..))
import Date.Extra.Utils as DateUtils
import TestUtils


tests : Test
tests =
  let
    currentOffsets = TestUtils.getZoneOffsets 2015
    _ = Debug.log "DurationTests currentOffsets" currentOffsets
    currentOffsetTest (offsets, test) =
      if currentOffsets == offsets then Just (test ()) else Nothing
  in
  describe "Date.Duration tests" <|
    [ describe "Duration.add" <|
        List.filterMap currentOffsetTest
          [ ( (-600, -600)
            , (\_ -> describe "At moment biased to offset UTC+1000 no daylight saving)"
                (List.map runAddCase addCases)
              )
            )
          , ( (150, 210)
            , (\_ -> describe "Date.Duration tests for offsets at Newfoundland -0330"
                (List.map runAddCase addCasesTZNeg0330)
              )
            )
          ]
    , describe "Duration.diff" <|
        List.filterMap currentOffsetTest
          [ ( (-600, -600)
            , (\_ -> describe "At moment biased to offset UTC+1000 no daylight saving)"
                (List.map runDiffCase diffCases)
              )
            )
          ]
    ]


runDiffCase : ( String , String, Duration.DeltaRecord ) -> Test
runDiffCase (date1Str, date2Str, expectedDiff) =
  test
    ( "date1 " ++ date1Str
      ++ " date2 " ++ date2Str
      ++ " expects \n DeltaRecord : " ++ (toString expectedDiff) ++ "\n"
      -- ++ " expects " ++ delta ++ "\n"
    ) <|
      let
        d1 = TestUtils.fudgeDate date1Str
        d2 = TestUtils.fudgeDate date2Str
        diff = Duration.diff d1 d2
        -- a = Debug.log "diff" (toString diff)
      in
        \() -> Expect.equal expectedDiff diff


diffCases : List ( String , String, Duration.DeltaRecord )
diffCases =
  [
    ( "2015/06/10 11:43:55.213"
    , "2015/06/10 11:43:55.212"
    , { year = 0, month = 0, day = 0
      , hour = 0, minute = 0, second = 0, millisecond = 1
      }
    )
  , ( "2015/06/10 11:43:55.212"
    , "2015/06/10 11:43:55.213"
    , { year = 0, month = 0, day = 0
      , hour = 0, minute = 0, second = 0, millisecond = -1
      }
    )
  , ( "2015/06/10 11:43:56.211"
    , "2015/06/10 11:43:55.212"
    , { year = 0, month = 0, day = 0
      , hour = 0, minute = 0, second = 0, millisecond = 999
      }
    )
  , ( "2015/06/10 11:43:55.212"
    , "2015/03/10 11:43:55.212"
    , { year = 0, month = 3, day = 0
      , hour = 0, minute = 0, second = 0, millisecond = 0
      }
    )
  , ( "2015/03/20 11:43:55.212"
    , "2016/05/15 11:43:55.212"
    , { year = -1, month = -1, day = -26
      , hour = 0, minute = 0, second = 0, millisecond = 0
      }
    )
  , ( "2016/05/15 11:43:55.212"
    , "2015/03/20 11:43:55.212"
    , { year = 1, month = 1, day = 26
      , hour = 0, minute = 0, second = 0, millisecond = 0
      }
    )

  -- NOTE: this is 25 days for one month. because April is 30 days.
  -- compare to next test, same days of successive months but number of day in month differs.
  , ( "2016/05/15 11:43:55.212"
    , "2016/04/20 11:43:55.212"
    , { year = 0, month = 0, day = 25
      , hour = 0, minute = 0, second = 0, millisecond = 0
      }
    )
  -- NOTE: This is 1 month 26 days for one month. because Mar is 31 days.
  , ( "2016/05/15 11:43:55.212"
    , "2016/03/20 11:43:55.212"
    , { year = 0, month = 1, day = 26
      , hour = 0, minute = 0, second = 0, millisecond = 0
      }
    )
  ]


{-
Test cases for Newfoundland UTC-0330 timezone.

From standard into daylight saving time boundary

  Date("2016-03-13 1:59:59.999") // 1457846999999
  Sun Mar 13 2016 01:59:59 GMT-0330 (Newfoundland Standard Time)

  // this is NOT a real clock time in local time zone, due to daylight shift.
  new Date("2016-03-13 02:00:00.000") // 1457847000000
  Sun Mar 13 2016 03:00:00 GMT-0230 (Newfoundland Daylight Time)

  new Date("2016-03-13 03:00:00.000") // 1457847000000
  Sun Mar 13 2016 03:00:00 GMT-0230 (Newfoundland Daylight Time)

  new Date(1457846999999)
  Sun Mar 13 2016 01:59:59 GMT-0330 (Newfoundland Standard Time)
  new Date(1457847000000)
  Sun Mar 13 2016 03:00:00 GMT-0230 (Newfoundland Daylight Time)


  Example of momentjs result.
  console.log(moment('2016-03-12 02:00:00.000').format())
  "2016-03-12T02:00:00-03:30"
  console.log(moment('2016-03-12 02:00:00.000').add(1, 'day').format())
  "2016-03-13T03:00:00-02:30"

Durations changes of unit size less than a Day don't compensate for daylight saving changes.
-}
addCasesTZNeg0330 =
  [ ( "2016/03/13 03:00:00.000" -- no change changes nothing 1457847000000
    , Millisecond, 0
    , "2016-03-13T03:00:00.000-0230" -- 1457847000000
    )
  , ( "2016/03/13 02:00:00.000" -- adjusted by zero returns shifted date 1457847000000
    , Millisecond, 0
    , "2016-03-13T03:00:00.000-0230" -- 1457847000000
    )

  , ( "2016/03/13 03:00:00.000" -- 1457847000000 (dst)
    , Millisecond, -1
    , "2016-03-13T01:59:59.999-0330" -- 1457846999999 (standard)
    )
  , ( "2016/03/13 01:59:59.999" -- 1457846999999 (standard)
    , Millisecond, 1
    , "2016-03-13T03:00:00.000-0230" -- 1457847000000 (dst)
    )
  , ( "2016/03/13 03:00:00.000" -- 1457847000000 (dst)
    , Second, -1
    , "2016-03-13T01:59:59.000-0330" -- 1457846999000 (standard)
    )
  , ( "2016/03/13 01:59:59.000" -- 1457846999000 (standard)
    , Second, 1
    , "2016-03-13T03:00:00.000-0230" -- 1457847000000 (dst)
    )
  , ( "2016/03/13 03:00:00.000" -- 1457847000000 (dst)
    , Minute, -1
    , "2016-03-13T01:59:00.000-0330" -- 1457846940000 (standard)
    )
  , ( "2016/03/13 01:59:00.000" -- 1457846940000 (standard)
    , Minute, 1
    , "2016-03-13T03:00:00.000-0230" -- 1457847000000 (dst)
    )
  , ( "2016/03/13 03:00:00.000" -- 1457847000000 (dst)
    , Hour, -1
    , "2016-03-13T01:00:00.000-0330" -- 1457843400000 (standard)
    )
  , ( "2016/03/13 01:00:00.000" -- 1457843400000 (standard)
    , Hour, 1
    , "2016-03-13T03:00:00.000-0230" -- 1457847000000 (dst)
    )

  -- 24 * Hour is different to 1 Day in how daylight saving is compensated.
  , ( "2016/03/13 03:00:00.000" -- 1457847000000 (dst)
    , Hour, -24 -- in Hour unit with DST shift its 24 + 1 hour dst shift
    , "2016-03-12T02:00:00.000-0330" -- 1457760600000 (standard)
    )
  , ( "2016/03/13 03:00:00.000" -- 1457847000000 (dst)
    , Day, -1
    , "2016-03-12T03:00:00.000-0330" -- 1457764200000 (standard)
    )

  , ( "2016/03/13 01:00:00.000" -- 1457843400000 (standard)
    , Hour, 24
    , "2016-03-14T02:00:00.000-0230" -- 1457847000000 (dst)
    )
  , ( "2016/03/13 01:00:00.000" -- 1457843400000 (standard)
    , Day, 1
    , "2016-03-14T01:00:00.000-0230" -- 1457926200000 (dst)
    )

  , ( "2016/03/12 02:00:00.00" -- 1457760600000 (standard)
      -- date + 1 Day is at start of day light saving
    , Hour, 24
      -- there is "2016-03-13T02" so this is 03 in DST
      -- can't apply DST hour compensation as it would go back to standard.
      -- so addiion of 24 Hour units is same as 1 Day here.
    , "2016-03-13T03:00:00.000-0230" -- 1457847000000 (dst)
    )
  , ( "2016/03/12 02:00:00.00" -- 1457760600000 (standard)
      -- date + 1 Day is at start of day light saving
    , Day, 1
      -- there is "2016-03-13T02" so this is 03 in DST
      -- can't apply DST hour compensation as it would go back to standard.
    , "2016-03-13T03:00:00.000-0230" -- 1457847000000 (dst)
    )
  , ( "2016/03/12 03:00:00.00" -- 1457764200000 (standard)
      -- date + 24 Hour is 1 hour into day light saving
    , Hour, 24
      -- Output is 4 as Hour units dont compensate for DST
    , "2016-03-13T04:00:00.000-0230" -- 1457847000000 (dst)
    )
  , ( "2016/03/12 03:00:00.00" -- 1457764200000 (standard)
      -- date + 1 day is 1 hour into day light saving
    , Day, 1
      -- Output is 3 to match input hour DST compensation
    , "2016-03-13T03:00:00.000-0230" -- 1457847000000 (dst)
    )

  -- subtract 1 month to just cross from DST back to standard
  , ( "2016/03/13 03:00:00.000-0230" -- 1457847000000 (dst)
    , Month, -1
    , "2016-02-13T03:00:00.000-0330" -- 1455345000000 (standard)
    )
  -- add 1 month to just cross from standard into DST
  , ( "2016/02/13 02:00:00.000" -- 1455345000000 (standard)
    , Month, 1
    , "2016-03-13T03:00:00.000-0230" -- 1457847000000 (dst)
    )

  -- years dont cross dst boundaries in general
  , ( "2016/03/13 03:00:00.000-0230" -- 1457847000000 (dst)
    , Year, -1
    , "2015-03-13T03:00:00.000-0230" -- 1426224600000 (dst)
    )
  -- years dont cross dst boundaries in general
  , ( "2016/03/13 03:00:00.000" -- 1455345000000 (standard)
    , Year, 1
    , "2017-03-13T03:00:00.000-0230" -- 1486967400000 (dst)
    )

  {-
  Test cases for Newfoundland UTC-0330 timezone.

  From daylight saving time into standard boundary

    new Date("2015-11-01 01:59:59.999") // 1446352199999
    Sun Nov 01 2015 01:59:59 GMT-0230 (Newfoundland Daylight Time)
    new Date("2015-11-01 02:00:00.000") // 1446355800000
    Sun Nov 01 2015 02:00:00 GMT-0330 (Newfoundland Standard Time)

    new Date(1446348600000) // 1446352199999+1-(60*60*1000) = 1446348600000
    Sun Nov 01 2015 01:00:00 GMT-0230 (Local Daylight Time)
    new Date(1446352199999)
    Sun Nov 01 2015 01:59:59 GMT-0230 (Newfoundland Daylight Time)
    new Date(1446352200000)
    Sun Nov 01 2015 01:00:00 GMT-0330 (Newfoundland Standard Time)
    new Date(1446355800000)
    Sun Nov 01 2015 02:00:00 GMT-0330 (Local Standard Time)

    Ticks in transition to standard is 1 hour of ticks to get to 2am.
    So 1am to 2am occurs effectively twice.
  -}

  , ( "2015/11/01 01:00:00.000-0330" -- 1446352200000 (standard)
    , Millisecond, -1
    , "2015-11-01T01:59:59.999-0230" -- 1446352199999 (dst)
    )
  , ( "2015-11-01T01:59:59.999-0230" -- 1446352199999 (dst)
    , Millisecond, 1
    , "2015-11-01T01:00:00.000-0330" -- 1446352200000 (standard)
    )

  , ( "2015/11/01 01:00:00.000-0330" -- 1446352200000 (standard)
    , Second, -1
    , "2015-11-01T01:59:59.000-0230" -- 1446352199000 (dst)
    )
  , ( "2015-11-01T01:59:59.000-0230" -- 1446352199000 (standard)
    , Second, 1
    , "2015-11-01T01:00:00.000-0330" -- 1446352200000 (dst)
    )

  , ( "2015/11/01 01:00:00.000-0330" -- 1446352200000 (standard)
    , Minute, -1
    , "2015-11-01T01:59:00.000-0230" -- 1446352140000 (dst)
    )
  , ( "2015-11-01T01:59:00.000-0230" -- 1446352140000 (standard)
    , Minute, 1
    , "2015-11-01T01:00:00.000-0330" -- 1446352200000 (dst)
    )

  , ( "2015/11/01 01:00:00.000-0330" -- 1446352200000 (standard)
    , Hour, -1
    , "2015-11-01T01:00:00.000-0230" -- 1446348600000 (dst)
    )
  , ( "2015-11-01T01:00:00.000-0230" -- 1446348600000 (standard)
    , Hour, 1
    , "2015-11-01T01:00:00.000-0330" -- 1446352200000 (dst)
    )

  , ( "2015/11/01 02:00:00.000-0330" -- 1446355800000 (standard)
    , Month, -1
    , "2015-10-01T02:00:00.000-0230" -- 1443673800000 (dst)
    )
  , ( "2015/10/01 02:00:00.000-0230" -- 1443673800000 (dst)
    , Month, 1
    , "2015-11-01T02:00:00.000-0330" -- 1446355800000 (standard)
    )

  , ( "2015/11/01 02:00:00.000-0330" -- 1446355800000 (standard)
    , Month, -2
    , "2015-09-01T02:00:00.000-0230" -- 1441081800000 (dst)
    )
  , ( "2015/09/01 02:00:00.000-0230" -- 1441081800000 (dst)
    , Month, 2
    , "2015-11-01T02:00:00.000-0330" -- 1446355800000 (standard)
    )

  -- this test left in as it exposed a specific problem early on
  -- it may duplicate other tests not in existence though.
  , ( "2016/03/31" -- 1459391400000
    , Month, -2
    , "2016-01-31T00:00:00.000-0330" -- 1454211000000
    )

  , ( "1970/01/01" -- 12600000
    , Month, 14
    , "1971-03-01T00:00:00.000-0330" -- 36646200000
    )
  , ( "1970/01/01" -- 12600000
    , Month, -14
    , "1968-11-01T00:00:00.000-0230" -- -36797400000
    )
  , ( "1968/02/01" -- -60467400000
    , Month, 12*44
    , "2012-02-01T00:00:00.000-0330" -- 1328067000000
    )
  , ( "2012/02/01" -- 1328067000000
    , Month, -(12*44)
    , "1968-02-01T00:00:00.000-0330" -- -60467400000
    )
  ]


runAddCase : ( String , Duration, Int , String ) -> Test
runAddCase (inputDateStr, duration, addend, expectedDateStr) =
  test
    ( "input " ++ inputDateStr
      ++ " add " ++ (toString duration)
      ++ " addend " ++ (toString addend)
      ++ " expects " ++ expectedDateStr ++ "\n"
    ) <|
    TestUtils.assertDateFuncOffset
      inputDateStr
      expectedDateStr
      (Duration.add duration addend)

-- The timezone these tests were originallly created in has no daylight
-- saving. The tests in addCasesTZNeg0330 are more complete and complex.
addCases =
  [ ( "2015/06/10 11:43:55.213"
    , Millisecond, 1
    , "2015-06-10T11:43:55.214+1000"
    )
  , ( "2015/06/10 11:43:55.213"
    , Second, 1
    , "2015-06-10T11:43:56.213+1000"
    )
  , ( "2015/06/10 11:43:55.213"
    , Minute, 1
    , "2015-06-10T11:44:55.213+1000"
    )
  , ( "2015/06/10 11:43:55.213"
    , Hour, 1
    , "2015-06-10T12:43:55.213+1000"
    )
  , ( "2015/06/10 11:43:55.213"
    , Day, 1
    , "2015-06-11T11:43:55.213+1000"
    )
  , ( "2015/06/10 11:43:55.213"
    , Week, 1
    , "2015-06-17T11:43:55.213+1000"
    )
  , ( "2015/06/10 11:43:55.213"
    , Month, 1
    , "2015-07-10T11:43:55.213+1000"
    )
  , ( "2015/06/10 11:43:55.213"
    , Year, 1
    , "2016-06-10T11:43:55.213+1000"
    )

  , ( "2015/02/28"
    , Day, 1
    , "2015-03-01T00:00:00.000+1000"
    )
  , ( "2012/02/28"
    , Day, 1
    , "2012-02-29T00:00:00.000+1000"
    )

  , ( "2012/02/29"
    , Day, -1
    , "2012-02-28T00:00:00.000+1000"
    )
  , ( "2015/01/01"
    , Day, -1
    , "2014-12-31T00:00:00.000+1000"
    )

  , ( "2015/06/10"
    , Month,  1
    , "2015-07-10T00:00:00.000+1000"
    )
  , ( "2015/01/02"
    , Month,  1
    , "2015-02-02T00:00:00.000+1000"
    )
  , ( "2015/01/31"
    , Month,  1
    , "2015-02-28T00:00:00.000+1000"
    )
  , ( "2012/01/31"
    , Month,  1
    , "2012-02-29T00:00:00.000+1000"
    )

  , ( "2015/07/10"
    , Month, -1
    , "2015-06-10T00:00:00.000+1000"
    )
  , ( "2015/02/02"
    , Month, -1
    , "2015-01-02T00:00:00.000+1000"
    )
  , ( "2015/02/28"
    , Month, -1
    , "2015-01-28T00:00:00.000+1000"
    )
  , ( "2012/02/29"
    , Month, -1
    , "2012-01-29T00:00:00.000+1000"
    )

  , ( "2012/02/29"
    , Month, 1
    , "2012-03-29T00:00:00.000+1000"
    )

  , ( "2015/06/10"
    , Month,  2
    , "2015-08-10T00:00:00.000+1000"
    )
  , ( "2015/01/03"
    , Month,  2
    , "2015-03-03T00:00:00.000+1000"
    )
  , ( "2015/01/31"
    , Month,  2
    , "2015-03-31T00:00:00.000+1000"
    )
  , ( "2012/01/31"
    , Month,  2
    , "2012-03-31T00:00:00.000+1000"
    )

  , ( "2015/07/10"
    , Month, -2
    , "2015-05-10T00:00:00.000+1000"
    )
  , ( "2015/02/02"
    , Month, -2
    , "2014-12-02T00:00:00.000+1000"
    )
  , ( "2015/02/28"
    , Month, -2
    , "2014-12-28T00:00:00.000+1000"
    )
  , ( "2012/02/29"
    , Month, -2
    , "2011-12-29T00:00:00.000+1000"
    )
  , ( "2012/03/31"
    , Month, -2
    , "2012-01-31T00:00:00.000+1000"
    )
  ]
