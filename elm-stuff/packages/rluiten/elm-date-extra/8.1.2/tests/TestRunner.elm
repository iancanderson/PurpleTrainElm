module TestRunner exposing (..)

{- Copyright (c) 2016 Robin Luiten -}
import Test exposing (..)
import Expect
import String
import Test.Runner exposing (run)
import Runner.Log
import Json.Encode exposing (Value)
import Html
import Date.Extra.CreateTests as CreateTests
import Date.Extra.UtilsTests as UtilsTests
import Date.Extra.CoreTests as CoreTests
import Date.Extra.PeriodTests as PeriodTests
import Date.Extra.DurationTests as DurationTests
import Date.Extra.TimeUnitTests as TimeUnitTests
import Date.Extra.FormatTests as FormatTests
import Date.Extra.CompareTests as CompareTests
import Date.Extra.FieldTests as FieldTests
import Date.Extra.ConfigTests as ConfigTests
import Date.Extra.ConvertingTests as ConvertingTests

main : Program Never () msg
main =
    Html.beginnerProgram
        { model = ()
        , update = \_ _ -> ()
        , view = \() -> Html.text "Check the console for useful output!"
        }
        |> Runner.Log.run 
            (describe "Date Extra Tests"
                            [ CreateTests.tests
                            , UtilsTests.tests
                            , CoreTests.tests
                            , PeriodTests.tests
                            , DurationTests.tests
                            , TimeUnitTests.tests
                            , FormatTests.tests
                            , CompareTests.tests
                            , FieldTests.tests
                            , ConfigTests.tests
                            , ConvertingTests.tests
                            ])