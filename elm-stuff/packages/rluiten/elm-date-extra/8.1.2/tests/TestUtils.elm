module TestUtils exposing (..)

{-| Useful for testing with Test.

Copyright (c) 2016 Robin Luiten
-}
import Date exposing (Date)
import Test exposing (..)
import Expect
import String
import Time exposing (Time)

import Date.Extra.Core as Core
import Date.Extra.Create as Create
import Date.Extra.Format as Format
import Date.Extra.Utils as DateUtils

import Date.Extra.Config.Config_en_au as Config
config = Config.config

dateStr = Format.isoString -- probably bad idea for now using.


{-| Helper for testing Date transform functions without offset.
-}
assertDateFunc :
     String
  -> String
  -> (Date -> Date) -> (() -> Expect.Expectation)
assertDateFunc inputDateStr expectedDateStr dateFunc =
  let
    -- inputDate = DateUtils.unsafeFromString inputDateStr
    inputDate = fudgeDate inputDateStr
    outputDate = dateFunc inputDate
    expectedDate = DateUtils.unsafeFromString expectedDateStr
    -- _ = Debug.log "assertDateFunc "
    --   ( "inputDate", inputDateStr, Format.isoStringNoOffset inputDate, Date.toTime inputDate
    --   , "expectedDate", expectedDateStr
    --   , "outputDate", Format.isoStringNoOffset outputDate, Date.toTime outputDate
    --   )
  in
    \() -> Expect.equal expectedDateStr (Format.isoStringNoOffset outputDate)


{-| Helper for testing Date transform functions, including offset.
-}
assertDateFuncOffset :
     String
  -> String
  -> (Date -> Date) -> (() -> Expect.Expectation)
assertDateFuncOffset inputDateStr expectedDateStr dateFunc =
  let
    -- inputDate = DateUtils.unsafeFromString inputDateStr
    inputDate = fudgeDate inputDateStr
    outputDate = dateFunc inputDate
    -- _ = Debug.log "assertDateFunc "
    --   ( "inputDate", inputDateStr, Format.isoString inputDate, Date.toTime inputDate
    --   , "expectedDate", expectedDateStr
    --   , "outputDate", Format.isoString outputDate, Date.toTime outputDate
    --   )
  in
    \() -> Expect.equal expectedDateStr (Format.isoString outputDate)


debugDumpDateFunc expectedDate testDate dateFunc =
  let
    _ = Debug.log("expectedDate")
      ( expectedDate
      , Result.map Core.toTime (Date.fromString expectedDate)
      , Result.map Format.isoString (Date.fromString expectedDate)
      )
    _ = Debug.log("testDate, toTime testDate")
      ( dateStr testDate
      , Date.toTime testDate
      )
    _ = Debug.log("dateFunc testDate, toTime dateFunc testDate")
      ( dateStr (dateFunc testDate)
      , Date.toTime (dateFunc testDate)
      )
  in
    True


{-| Helper to compare Results with an offset on there Ok value.
Initially created for makeDateTicksTest2.
-}
assertResultEqualWithOffset :
     Result String Float
  -> Result String Float
  -> Int
  -> (() -> Expect.Expectation)
assertResultEqualWithOffset expected test offset =
  \() -> 
    case expected of
      Ok expectedTicks ->
        case test of
          Ok testTicks ->
            let _ = Debug.log("ooo") (expectedTicks - testTicks)
            in
            Expect.equal expectedTicks (testTicks + (toFloat offset))
          Err msg ->
            let
              _ = Debug.log ("assertResultEqualWithOffset Err ") (msg)
            in
              Expect.fail msg
      Err msg ->
        let
          _ = Debug.log ("assertResultEqualWithOffset Err ") (msg)
        in
          Expect.fail msg





logResultDate : String -> Result String Date -> Bool
logResultDate str result =
  case result of
    Ok date ->
      let _ = Debug.log(str) (Format.utcIsoString date)
      in  False
    Err msg ->
      let _ = Debug.log(str) ("Err " ++ msg)
      in  False


logDate : Date -> Date
logDate date =
  let
    _ = Debug.log("logDate") (Format.utcIsoString date)
  in
    date




{-| Return min and max zone offsets in current zone.

As a rule (fst (getZoneOffsets year)) will return standard timezoneOffset
for local zone as per referenced information.

http://stackoverflow.com/questions/11887934/check-if-daylight-saving-time-is-in-effect-and-if-it-is-for-how-many-hours/11888430#11888430
-}
getZoneOffsets : Int -> (Int, Int)
getZoneOffsets year =
  let
    jan01offset =
      Create.dateFromFields year Date.Jan 1 0 0 0 0
        |> Create.getTimezoneOffset
    jul01offset =
      Create.dateFromFields year Date.Jun 1 0 0 0 0
        |> Create.getTimezoneOffset
    minOffset = min jan01offset jul01offset
    maxOffset = max jan01offset jul01offset
    -- _ = Debug.log "isOffset" (minOffset, maxOffset, jan01offset, jul01offset)
  in
    (minOffset, maxOffset)


--
-- firefox wont parse "2016/06/05 04:03:02.111" it really
-- requires "2016-06-05T04:03:02.111+1000" with local offset
-- to get right offset we need a date to start with so
-- we convert str into date with out milliseconds then
-- again with milliseconds and right format with offset.
--
fudgeDate : String -> Date
fudgeDate str =
  -- let
  --   _ = Debug.log "fudgeDate" str
  -- in
    case String.split "." str of
      _::[] -> -- no "." so no milliseconds so dont do tricky
        DateUtils.unsafeFromString str

      beforeDot::afterDot ->
        -- afterDot maybe .XXX or .XXX-Offset so check for + or - of offset and do nothing
        let
          strAfterDot = String.concat afterDot
        in
          if String.contains "+" strAfterDot
            || String.contains "-" strAfterDot then
            DateUtils.unsafeFromString str
          else
            let
              date = DateUtils.unsafeFromString beforeDot
              newStr =
                String.concat
                  [ Format.format config Format.isoFormat date
                  , "."
                  , strAfterDot
                  , Format.format config "%z" date
                  ]
              -- _ = Debug.log "fudgeDate newStr" newStr
            in
              DateUtils.unsafeFromString newStr

      [] ->
        DateUtils.unsafeFromString str
        --Debug.crash "We got a fed a date not in expected format" True
