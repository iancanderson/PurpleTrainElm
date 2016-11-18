module Date.Extra.FieldTests exposing (..)

import Debug
import Date exposing (Date)
import Test exposing (..)
import Expect
-- import Time exposing (Time)

import Date.Extra.Create as Create
import Date.Extra.Format as Format
import Date.Extra.Utils as DateUtils
import Date.Extra.Field as Field exposing (Field (..))
import TestUtils


tests : Test
tests =
  describe "Date.Field tests"
    [ describe "fieldDate tests" <|
        List.map runFieldCase fieldCases
    , describe "fieldDateClamp tests" <|
        List.map runFieldClampCase fieldClampCases
    ]


runFieldCase (dateStr, field, expectedDate) =
  let
    date = TestUtils.fudgeDate dateStr
    dateOut = Field.fieldToDate field date
    dateOutStr = Maybe.map Format.isoStringNoOffset dateOut
    -- dateOut2Str = Maybe.map Format.isoStringNoOffset dateOut
    -- _ = Debug.log("runFieldCase") (dateStr, date, dateFloor, dateOut, dateOutStr, dateOut2Str)
  in
    test ("field " ++ (toString field)
          ++ " on " ++ dateStr
          ++ " expects " ++ toString expectedDate ++ ".\n") <|
      \() -> Expect.equal (expectedDate) (dateOutStr)


fieldCases =
    [ ( "2016/06/05 04:03:02.111"
    , Millisecond 1
    , Just "2016-06-05T04:03:02.001"
    )
  , ( "2016/06/05 04:03:02.111"
    , Second 3
    , Just "2016-06-05T04:03:03.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , Millisecond 1000
    , Nothing
    )
  , ( "2016/06/05 04:03:02.111"
    , Millisecond -1
    , Nothing
    )
  , ( "2016/06/05 04:03:02.111"
    , Second 60
    , Nothing
    )
  , ( "2016/06/05 04:03:02.111"
    , Second -1
    , Nothing
    )
  , ( "2016/06/05 04:03:02.111"
    , Minute 60
    , Nothing
    )
  , ( "2016/06/05 04:03:02.111"
    , Minute -1
    , Nothing
    )
  , ( "2016/06/05 04:03:02.111"
    , Hour 24
    , Nothing
    )
  , ( "2016/06/05 04:03:02.111"
    , Hour -1
    , Nothing
    )
  , ( "2016/06/05 04:03:02.111"
    , DayOfMonth 0
    , Nothing
    )
  , ( "2016/06/05 04:03:02.111"
    , DayOfMonth 31
    , Nothing
    )
  , ( "2016/06/05 04:03:02.111"
    , Year -1
    , Nothing
    )
  , ( "2016/06/05 04:03:02.111"
    , DayOfMonth 31
    , Nothing
    )
  , ( "2016/06/05 04:03:02.111" -- 2016/06/05 is Sunday
    , DayOfWeek (Date.Mon, Date.Mon)
    , Just "2016-05-30T04:03:02.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , DayOfWeek (Date.Mon, Date.Sun)
    , Just "2016-06-06T04:03:02.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , DayOfWeek (Date.Thu, Date.Thu)
    , Just "2016-06-02T04:03:02.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , DayOfWeek (Date.Sat, Date.Sun)
    , Just "2016-06-11T04:03:02.111"
    )
  ]


runFieldClampCase (dateStr, field, expectedDate) =
  let
    date = TestUtils.fudgeDate dateStr
    dateOut = Field.fieldToDateClamp field date
    dateOutStr = Format.isoStringNoOffset dateOut
    -- dateOut2Str = Format.isoStringNoOffset dateOut
    -- _ = Debug.log("runFieldCase") (dateStr, date, dateFloor, dateOut, dateOutStr, dateOut2Str)
  in
    test ("field " ++ (toString field)
          ++ " on " ++ dateStr
          ++ " expects " ++ toString expectedDate ++ ".\n") <|
      \() -> Expect.equal (expectedDate) (dateOutStr)


-- these are same input cases as FieldCases, different results for clamp
fieldClampCases =
  [ ( "2016/06/05 04:03:02.111"
    , Millisecond 1
    , "2016-06-05T04:03:02.001"
    )
  , ( "2016/06/05 04:03:02.111"
    , Second 3
    , "2016-06-05T04:03:03.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , Millisecond 1000
    , "2016-06-05T04:03:02.999"
    )
  , ( "2016/06/05 04:03:02.111"
    , Millisecond -1
    , "2016-06-05T04:03:02.000"
    )
  , ( "2016/06/05 04:03:02.111"
    , Second 60
    , "2016-06-05T04:03:59.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , Second -1
    , "2016-06-05T04:03:00.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , Minute 60
    , "2016-06-05T04:59:02.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , Minute -1
    , "2016-06-05T04:00:02.111"
    )

  , ( "2016/06/05 04:03:02.111"
    , Hour 24
    , "2016-06-05T23:03:02.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , Hour -1
    , "2016-06-05T00:03:02.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , DayOfMonth 0
    , "2016-06-01T04:03:02.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , DayOfMonth 31
    , "2016-06-30T04:03:02.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , Year -1
    , "0000-06-05T04:03:02.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , DayOfMonth 31
    , "2016-06-30T04:03:02.111"
    )
  , ( "2016/06/05 04:03:02.111" -- 2016/06/05 is Sunday
    , DayOfWeek (Date.Mon, Date.Mon)
    , "2016-05-30T04:03:02.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , DayOfWeek (Date.Mon, Date.Sun)
    , "2016-06-06T04:03:02.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , DayOfWeek (Date.Thu, Date.Thu)
    , "2016-06-02T04:03:02.111"
    )
  , ( "2016/06/05 04:03:02.111"
    , DayOfWeek (Date.Sat, Date.Sun)
    , "2016-06-11T04:03:02.111"
    )
  ]
