{-| An example of formatting dates.

Copyright (c) 2016 Robin Luiten
-}

import Date
import Html exposing (Html, button, div, text)
import Html.App as Html

import Date.Extra.Config.Config_en_au exposing (config)
import Date.Extra.Format as Format exposing (format, formatUtc, isoMsecOffsetFormat)


{- Configured format with config and format string.
* `config` is form the English Austrlian Config module.
* `config.format.datetime` is "%d/%m/%Y %H:%M:%S"
-}
displayString1 =
  Result.withDefault "Failed to get a date." <|
    Result.map
      (format config config.format.dateTime)
      (Date.fromString "2015-06-01 12:45:14.211Z")


{- Configured formatUtc with config and format string.
`isoMsecOffsetFormat` is "%Y-%m-%dT%H:%M:%S.%L%z"
-}
displayString2 =
  Result.withDefault "Failed to get a date." <|
    Result.map
      (formatUtc config isoMsecOffsetFormat)
      (Date.fromString "2015-06-01 12:45:14.211Z")


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
      (  "Display String 1 Australian date time format \""
      ++ displayString1 ++ "\". "
      )
    ]
  , div []
    [ text
      (  "Display String 2 UTC iso format \""
      ++ displayString2 ++ "\". "
      )
    ]
  ]
