module Date.Extra.CreateTests exposing (..)

import Date exposing (Date)
import Test exposing (..)
import Expect
import Time exposing (Time)

import Date.Extra.Config.Config_en_au as Config_en_au
import Date.Extra.Create as Create
import Date.Extra.Format as Format
import TestUtils

config_en_au = Config_en_au.config

-- _ = Debug.log "(zone offset 2016)" (TestUtils.getZoneOffsets 2016)
-- _ = Debug.log "(zone offset 1970)" (TestUtils.getZoneOffsets 1970)

{-
More timezone tests could be added for other timezones, I don't think
they would necessarilly expose more edge cases to be handled.
I am happy to be proved wrong however.
-}
tests : Test
tests =
  let
    currentOffsets = TestUtils.getZoneOffsets 2015
    _ = Debug.log "CreateTests currentOffsets" currentOffsets
    currentOffsetTest (offsets, test) =
      if currentOffsets == offsets then Just (test ()) else Nothing
  in
    describe "Create module tests" <|
      [ describe "Create.getTimezoneOffset - each describe PASSES in matching time zone ONLY." <|
        List.filterMap currentOffsetTest
          [ ( (-600, -600) -- Brisbane no day light saving
            , testPos10Brisbane
            )
          , ( (-660, -600) -- Sydney with day light saving
            , testPos10Sydney
            )
          , ( (150, 210) -- Newfoundland with day light saving negative offset
            , testNeg0330NewFoundland
            )
          ]
      , describe "Create.dateFromFields Create.timeFromFields"
          [ fromFieldsTests()
          ]
      ]


testPos10Sydney _ =
  let
    currentOffsets = TestUtils.getZoneOffsets 2015
    -- _ = Debug.log "testPos10Sydney currentOffset" currentOffsets
  in
    if currentOffsets /= (-660, -600) then
      test
        """This test describe requires to be run in a specific time zone.
           Sydney UTC+1000 with daylight saving variations.
        """ <|
        \() -> Expect.equal True False
    else
      describe "Timezone +1000 Sydney (daylight saving)"
        [ test "Dummy passing test." (\() -> Expect.equal True True)

        , test "getTimezoneOffset at Epoch" <|
            \() -> Expect.equal -660 (Create.getTimezoneOffset (Date.fromTime 0))

        , test "getTimezoneOffset in standard" <|
            \() -> Expect.equal (Result.Ok -600)
              ( Result.map
                  Create.getTimezoneOffset
                  (Date.fromString "2016-06-01")
              )

          {- -----
          // from standard into daylight saving time boundary
          new Date("2015-10-04 01:59:59.999") // 1443887999999
          Sun Oct 04 2015 01:59:59 GMT+1000 (Local Standard Time)
          new Date("2015-10-04 02:00:00.000") // 1443888000000
          Sun Oct 04 2015 03:00:00 GMT+1100 (Local Daylight Time)

          new Date(1443887999999)
          Sun Oct 04 2015 01:59:59 GMT+1000 (Local Standard Time)
          new Date(1443888000000)
          Sun Oct 04 2015 03:00:00 GMT+1100 (Local Daylight Time)
          ----- -}
        , test "getTimezoneOffset just before daylight saving" <|
            \() -> Expect.equal (Result.Ok -600)
              ( Result.map
                  Create.getTimezoneOffset
                  (Date.fromString "2015-10-04 01:59:59.999")
              )

        , test "getTimezoneOffset just after daylight saving" <|
            \() -> Expect.equal (Result.Ok -660)
              ( Result.map
                  Create.getTimezoneOffset
                  (Date.fromString "2015-10-04 02:00:00.000")
              )

        , test "getTimezoneOffset just before daylight saving from time" <|
            \() -> Expect.equal -600 (Create.getTimezoneOffset (Date.fromTime 1443887999999.0))

        , test "getTimezoneOffset just into daylight saving from time" <|
            \() -> Expect.equal -660 (Create.getTimezoneOffset (Date.fromTime 1443888000000.0))


          {- -----

          // from daylight saving into standard time boundary
          new Date("2015-04-05 02:59:59.999") // 1428163199999
          Sun Apr 05 2015 02:59:59 GMT+1100 (Local Daylight Time)
          new Date("2015-04-05 03:00:00.000") // 1428166800000
          Sun Apr 05 2015 03:00:00 GMT+1000 (Local Standard Time)

          new Date(1428163199999)
          Sun Apr 05 2015 02:59:59 GMT+1100 (Local Daylight Time)
          new Date(1428163200000)
          Sun Apr 05 2015 02:00:00 GMT+1000 (Local Standard Time)

          ----- -}
        , test "getTimezoneOffset just before standard" <|
            \() -> Expect.equal (Result.Ok -660)
              ( Result.map
                  Create.getTimezoneOffset
                  (Date.fromString "2015-04-05 02:59:59.9999")
              )

        , test "getTimezoneOffset just into standard" <|
            \() -> Expect.equal (Result.Ok -600)
              ( Result.map
                  Create.getTimezoneOffset
                  (Date.fromString "2015-04-05 03:00:00.000")
              )

        , test "getTimezoneOffset just before standard from time" <|
            \() -> Expect.equal -660 (Create.getTimezoneOffset (Date.fromTime 1428163199999.0))

        , test "getTimezoneOffset just after standard1 from time" <|
            \() -> Expect.equal -600 (Create.getTimezoneOffset (Date.fromTime 1428166800000.0))

        , test "getTimezoneOffset just after standard2 from time" <|
            \() -> Expect.equal -600 (Create.getTimezoneOffset (Date.fromTime 1428163200000.0))
        ]


-- Very few tests as no timezones that complicate it.
testPos10Brisbane _ =
  let
    currentOffsets = TestUtils.getZoneOffsets 2015
  in
    if currentOffsets /= (-600, -600) then
      test
        """This test describe requires to be run in a specific time zone.
           Brisbane UTC+1000 with no daylight saving.
        """ <|
        \() -> Expect.equal True False
    else
      describe "Timezone +1000 Brisbane (no daylight saving)"
        [ test "Dummy passing test." (\() -> Expect.equal True True)

        , test "getTimezoneOffset at Epoch" <|
            \() -> Expect.equal -600 (Create.getTimezoneOffset (Date.fromTime 0))

        , test "getTimezoneOffset in standard" <|
            \() -> Expect.equal (Result.Ok -600)
              ( Result.map
                  Create.getTimezoneOffset
                  (Date.fromString "2016-01-01")
              )
        ]


testNeg0330NewFoundland _ =
  let
    currentOffsets = TestUtils.getZoneOffsets 2015
  in
    if currentOffsets /= (150, 210) then
      test
        """This test describe requires to be run in a specific time zone.
           Newfoundland UTC-0330 with offsets of -02:30 and -03:30.
        """ <|
        \() -> Expect.equal True False
    else
      describe "Timezone -0330 Newfoundland (daylight saving)"
        [ test "Dummy passing test." (\() -> Expect.equal True True)

        , test "getTimezoneOffset at Epoch" <|
            \() -> Expect.equal 210 (Create.getTimezoneOffset (Date.fromTime 0))

        , test "getTimezoneOffset in standard" <|
            \() -> Expect.equal (Result.Ok 210)
              ( Result.map
                  Create.getTimezoneOffset
                  (Date.fromString "2016/01/01")
              )

        , test "getTimezoneOffset in day light saving" <|
            \() -> Expect.equal (Result.Ok 150)
              ( Result.map
                  Create.getTimezoneOffset
                  (Date.fromString "2016/04/01")
              )

          {- -----

          // from standard into daylight saving time boundary
          new Date("2016-03-13 1:59:59.999") // 1457846999999
          Sun Mar 13 2016 01:59:59 GMT-0330 (Newfoundland Standard Time)
          new Date("2016-03-13 02:00:00.000") // 1457847000000
          // this is NOT a real clock time in local time zone, due to daylight shift.
          Sun Mar 13 2016 03:00:00 GMT-0230 (Newfoundland Daylight Time)
          new Date("2016-03-13 03:00:00.000") // 1457847000000
          // this is a real clock time in local time zone, due to daylight shift.
          Sun Mar 13 2016 03:00:00 GMT-0230 (Newfoundland Daylight Time)

          new Date(1457846999999)
          Sun Mar 13 2016 01:59:59 GMT-0330 (Newfoundland Standard Time)
          new Date(1457847000000)
          Sun Mar 13 2016 03:00:00 GMT-0230 (Newfoundland Daylight Time)

          ----- -}
        , test "getTimezoneOffset just before daylight saving" <|
            \() -> Expect.equal (Result.Ok 210)
              ( Result.map
                  Create.getTimezoneOffset
                  (Date.fromString "2016/03/13 1:59:59.999")
              )

        , test "getTimezoneOffset just into daylight saving (Not Real Time)" <|
            \() -> Expect.equal (Result.Ok 150)
              ( Result.map
                  Create.getTimezoneOffset
                  (Date.fromString "2016/03/13 02:00:00.000")
              )

        , test "getTimezoneOffset just into daylight saving" <|
            \() -> Expect.equal (Result.Ok 150)
              ( Result.map
                  Create.getTimezoneOffset
                  (Date.fromString "2016-03-13T03:00:00.000-0330")
              )

        , test "getTimezoneOffset just before daylight saving from time" <|
            \() -> Expect.equal 210 (Create.getTimezoneOffset (Date.fromTime 1457846999999.0))

        , test "getTimezoneOffset just into daylight saving from time" <|
            \() -> Expect.equal 150 (Create.getTimezoneOffset (Date.fromTime 1457847000000.0))

        {- -----

        // from daylight saving time into standard boundary
        new Date("2015-11-01 01:59:59.999") // 1446352199999
        Sun Nov 01 2015 01:59:59 GMT-0230 (Newfoundland Daylight Time)
        new Date("2015-11-01 02:00:00.000") // 1446355800000
        Sun Nov 01 2015 02:00:00 GMT-0330 (Newfoundland Standard Time)

        new Date(1446352199999)
        Sun Nov 01 2015 01:59:59 GMT-0230 (Newfoundland Daylight Time)
        new Date(1446352200000)
        Sun Nov 01 2015 01:00:00 GMT-0330 (Newfoundland Standard Time)

        ----- -}
        , test "getTimezoneOffset just before standard" <|
            \() -> Expect.equal (Result.Ok 150)
              ( Result.map
                  Create.getTimezoneOffset
                  (Date.fromString "2015/11/01 01:59:59.999")
              )

        , test "getTimezoneOffset just into standard" <|
            \() -> Expect.equal (Result.Ok 210)
              ( Result.map
                  Create.getTimezoneOffset
                  (Date.fromString "2015/11/01 02:00:00.000")
              )

        , test "getTimezoneOffset just before standard from time" <|
            \() -> Expect.equal 150 (Create.getTimezoneOffset (Date.fromTime 1446352199999.0))

        , test "getTimezoneOffset just after standard1 from time" <|
            \() -> Expect.equal 210 (Create.getTimezoneOffset (Date.fromTime 1446355800000.0))

        , test "getTimezoneOffset just after standard2 from time" <|
            \() -> Expect.equal 210 (Create.getTimezoneOffset (Date.fromTime 1446352200000.0))


        {-
        from JS.

        -- so date parse returns
        new Date("2015-11-01 01:59:59.999"))
        Sun Nov 01 2015 01:59:59 GMT-0230 (Local Daylight Time) // 1446352199999

        This is the one in that occurs one hour after the above one.
        When we flip over into the new offset for daylight saving.
        new Date(1446355799999)
        Sun Nov 01 2015 01:59:59 GMT-0330 (Local Standard Time)

        -}
        , test "getTimezoneOffset on edge of standard to daylight transition 1" <|
            \() -> Expect.equal 210 (Create.getTimezoneOffset (Date.fromTime 1446355799999.0))

        ]


-- `dateFromFields` Return a date in local time zone with field values.
-- Comparison does not include offset as that is local time zone dependent.
fromFieldsTests _ =
  describe "dateFromFields timeFromFields tests"
    [ test "test dateFromFields for Date time" <|
        \() -> Expect.equal
          "2016-01-29T11:07:47.111"
          (testDateFromFields 2016 Date.Jan 29 11 07 47 111)
    , test "test dateFromFields for Date time around epoch" <|
        \() -> Expect.equal
          "1970-01-01T05:09:13.111"
          (testDateFromFields 1970 Date.Jan 1 5 9 13 111)
    , test "test timeFromFields" <|
        \() -> Expect.equal
          "1970-01-01T07:09:13.111"
          (testTimeFromFields 7 9 13 111)
    , test "test dateFromFields (Issue #17)" <|
        \() -> Expect.equal
          "2016-07-08T00:00:00.000"
          (testDateFromFields 2016 Date.Jul 8 0 0 0 0)
    , test "test dateFromFields not in just before dst (Issue #17)" <|
        \() -> Expect.equal
          "2016-03-13T00:00:00.000"
          (testDateFromFields 2016 Date.Mar 13 0 0 0 0)
    , test "test dateFromFields just in dst (Issue #17)" <|
        \() -> Expect.equal
          "2016-03-14T00:00:00.000"
          (testDateFromFields 2016 Date.Mar 14 0 0 0 0)
    , test "test dateFromFields not in dst (Issue #17)" <|
        \() -> Expect.equal
          "2016-01-08T00:00:00.000"
          (testDateFromFields 2016 Date.Jan 8 0 0 0 0)
    ]


-- test helper
testDateFromFields year month day hour minute second millisecond =
  let
    -- _ = Debug.log "testDateFromFields" (1, "year", year)
    date = Create.dateFromFields year month day hour minute second millisecond
    dateOffset = Create.getTimezoneOffset date
    -- _ = Debug.log "testDateFromFields" (3, "dateOffset", dateOffset)
  in
    Format.formatOffset config_en_au dateOffset Format.isoMsecFormat date


-- test helper
testTimeFromFields hour minute second millisecond =
  let
    date = Create.timeFromFields hour minute second millisecond
  in
    Format.formatOffset
      config_en_au
      (Create.getTimezoneOffset date)
      Format.isoMsecFormat
      (date)
