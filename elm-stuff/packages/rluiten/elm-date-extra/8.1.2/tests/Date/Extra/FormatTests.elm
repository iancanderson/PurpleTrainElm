module Date.Extra.FormatTests exposing (..)

{- Test date format.

Copyright (c) 2016 Robin Luiten
-}

import Date exposing (Date)
import Test exposing (..)
import Expect
import Time exposing (Time)

-- import Date.Config as Config
import Date.Extra.Core as Core
import Date.Extra.Format as Format
import Date.Extra.Config.Config_en_us as Config_en_us
import Date.Extra.Config.Config_en_au as Config_en_au
import Date.Extra.Period as DPeriod exposing (Period (Hour))


en_au_config = Config_en_au.config
en_us_config = Config_en_us.config


tests : Test
tests =
  describe "Date.Format tests"
    [ describe "format tests" <|
        List.map runFormatTest formatTestCases
    , describe "formatUtc tests" <|
        List.map runFormatUtcTest formatUtcTestCases
    , describe "formatOffset tests" <|
        List.map runformatOffsetTest formatOffsetTestCases
    ]


{-

Time : 1407833631116
  is : 2014-08-12T08:53:51.116+00:00
  is : 2014-08-12T18:53:51.116+10:00
  is : 2014-08-12T04:53:51.116-04:00

  In a specific time zone... that showed errors.
  "Tue Aug 12 2014 04:53:51 GMT-0400 (Eastern Daylight Time)""
  toUTCString() is : "Tue, 12 Aug 2014 08:53:51 GMT"
  toISOString() is : "2014-08-12T08:53:51.116Z"

Time : 1407855231116
  is : 2014-08-12T14:53:51.116+00:00
  is : 2014-08-13T00:53:51.116+10:00


Using floor here to work around bug in Elm 0.16 on Windows
that cant produce this as integer into the javascript source.

-}
aTestTime = floor 1407833631116.0
aTestTime2 = floor 1407855231116.0
aTestTime3 = floor -48007855231116.0 -- year 448

aTestTime4 = floor -68007855231116.0 -- problem year negative year out disabled test.
aTestTime5 = floor 1407182031000.0 -- 2014-08-04T19:53:51.000Z
aTestTime6 = floor 1407117600000.0 -- 2014-08-04T12:00:00.000+10:00
aTestTime7 = floor 1407074400000.0 -- 2014-08-04T00:00:00.000+10:00
aTestTime8 = floor 1375426800000.0 -- 2013-08-02T17:00:00.000+10:00
aTestTime9 = floor -55427130000000.0 -- 0213-08-02T17:00:00.000+10:00

-- forces to +10:00 time zone so will run on any time zone
runFormatTest (name, expected, formatStr, time) =
  let
    asDate = Core.fromTime time
    -- _ = Debug.log "runFormatTest"
    --   ( "name", name
    --   , (Date.year asDate, Date.month asDate, Date.day asDate, Date.hour asDate)
    --   , "time", time
    --   , "format", (Format.formatOffset Config_en_us.config -600 formatStr asDate)
    --   )
  in
    test name <|
    \() ->
        Expect.equal
          expected
          (Format.formatOffset Config_en_us.config -600 formatStr asDate)


formatTestCases =
  [ ("numeric date", "12/08/2014", "%d/%m/%Y", aTestTime)
  , ("spelled out date", "Tuesday, August 12, 2014", "%A, %B %d, %Y", aTestTime)
  , ("with %% ", "% 12/08/2014", "%% %d/%m/%Y", aTestTime)
  , ("with %% no space", " %12/08/2014", " %%%d/%m/%Y", aTestTime)
  , ("with milliseconds", "2014-08-12 (.116)", "%Y-%m-%d (.%L)", aTestTime)

  -- in EDT GMT-04:00
  -- Tue Aug 12 2014 04:53:51 GMT-0400 (Eastern Daylight Time)
  , ("with milliseconds 2", "2014-08-12T18:53:51.116", "%Y-%m-%dT%H:%M:%S.%L", aTestTime)
  , ("small year", "0448-09-09T22:39:28.884", "%Y-%m-%dT%H:%M:%S.%L", aTestTime3)

  , ("Config_en_us date", "8/5/2014", en_us_config.format.date, aTestTime5)
  , ("Config_en_us longDate", "Tuesday, August 05, 2014", en_us_config.format.longDate, aTestTime5)
  , ("Config_en_us time", "5:53 AM", en_us_config.format.time, aTestTime5)
  , ("Config_en_us longTime", "5:53:51 AM", en_us_config.format.longTime, aTestTime5)
  , ("Config_en_us dateTime", "8/5/2014 5:53 AM", en_us_config.format.dateTime, aTestTime5)
  , ("Config_en_us dateTime test PM", "8/4/2014 12:00 PM", en_us_config.format.dateTime, aTestTime6)
  , ("Config_en_us dateTime test AM", "8/4/2014 12:00 AM", en_us_config.format.dateTime, aTestTime7)

  , ("Config_en_au date", "5/08/2014", en_au_config.format.date, aTestTime5)
  , ("Config_en_au longDate", "Tuesday, 5 August 2014", en_au_config.format.longDate, aTestTime5)
  , ("Config_en_au time", "5:53 AM", en_au_config.format.time, aTestTime5)
  , ("Config_en_au longTime", "5:53:51 AM", en_au_config.format.longTime, aTestTime5)
  , ("Config_en_au dateTime", "5/08/2014 5:53 AM", en_au_config.format.dateTime, aTestTime5)

  , ("Config_en_us date", "8/12/2014", en_us_config.format.date, aTestTime)

  -- year rendered negative ? boggle :) disabled for not supporting at moment
  --, ("small year", "0448-09-09T22:39:28.885", "%Y-%m-%dT%H:%M:%S.%L", aTestTime4)

  , ("Check day 12 ordinal date format with out padding", "[12][12th]", "[%-d][%-@d]", aTestTime)
  , ("Check day 12 ordinal date format with padding", "[12][12th]", "[%e][%@e]", aTestTime)
  , ("Check day 2 ordinal date format with out padding", "[2][2nd]", "[%-d][%-@d]", aTestTime8)
  , ("Check day 2 ordinal date format with padding", "[ 2][ 2nd]", "[%e][%@e]", aTestTime8)
  , ("Check short year field ", "0213", "%Y", aTestTime9)
  , ("Check 2 digit year field ", "13", "%y", aTestTime9)
  ]


runFormatUtcTest (name, expected, formatStr, time) =
  test name <|
    \() ->
      Expect.equal
        expected
        (Format.formatUtc Config_en_us.config formatStr (Core.fromTime time))


formatUtcTestCases =
  [ ( "get back expected date in utc +00:00", "2014-08-12T08:53:51.116+00:00"
    , "%Y-%m-%dT%H:%M:%S.%L%:z", aTestTime
    )
  ]


runformatOffsetTest (name, expected, formatStr, time, offset) =
  test name <|
    \() ->
      Expect.equal
        expected
        (Format.formatOffset Config_en_us.config offset formatStr (Core.fromTime time))


formatOffsetTestCases =
  [ ( "get back expected date in utc -04:00", "2014-08-12T04:53:51.116-04:00"
    , "%Y-%m-%dT%H:%M:%S.%L%:z", aTestTime, 240
    )
  , ( "get back expected date in utc -12:00", "2014-08-12T20:53:51.116+12:00"
    , "%Y-%m-%dT%H:%M:%S.%L%:z", aTestTime, -720
    )
  , ( "12 hour time %I", "Wednesday, 13 August 2014 12:53:51 AM"
    , "%A, %e %B %Y %I:%M:%S %p"
    , aTestTime2, -600
    )
  , ( "12 hour time %l", "Wednesday, 13 August 2014 12:53:51 AM"
    , "%A, %e %B %Y %l:%M:%S %p"
    , aTestTime2, -600
    )
  ]
