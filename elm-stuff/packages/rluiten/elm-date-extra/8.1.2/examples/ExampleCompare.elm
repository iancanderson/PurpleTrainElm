{-| Comparing dates.

Copyright (c) 2016 Robin Luiten
-}

import Date
import Html exposing (Html, button, div, text)
import Html.App as Html

import Date.Extra.Compare as Compare exposing (is, Compare2 (..))


{- Time 1407833631161.0 in utc is "2014-08-12 08:53:51.161" -}
testDate1 = Date.fromTime 1407833631161.0


{- Time 1407833631162.0 in utc is "2014-08-12 08:53:51.162" -}
testDate2 = Date.fromTime 1407833631162.0


main =
  Html.beginnerProgram
    { model = ()
    , view = view
    , update = (\_ model -> model)
    }

view model =
  div []
  [ div []
    [ text
      (  "Test is date1 After date2 should be False and is = "
      ++ (toString (is After testDate1 testDate2)) ++ ". "
      )
    ]
  , div []
    [ text
      (  "Test is date1 Before date2 should be True and is = "
      ++ (toString (is Before testDate1 testDate2)) ++ ". "
      )
    ]
  ]
