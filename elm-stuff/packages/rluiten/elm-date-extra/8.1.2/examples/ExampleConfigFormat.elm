{-| An example of adjusting the Config for Format.

Configure the month name produced when formatting dates.

This example modifies an existing Config but you can create
your own Config without using existing ones as well.

You can also use existing translations in the Date.Config.I18n namespace if
they match your language needs for your own config.

Copyright (c) 2016 Robin Luiten
-}

import Date
import Html exposing (Html, button, div, text)
import Html.App as Html
import String

import Date.Extra.Config.Config_en_au exposing (config)
import Date.Extra.Format as Format exposing (format)


{- Modify the i18n in config to change month names so they area reversed. -}
configReverseMonthName =
  let
    i18nCurrent = config.i18n
    i18nUpdated =
      { i18nCurrent
      | monthName = String.reverse << i18nCurrent.monthName
      }
  in
    { config
    | i18n = i18nUpdated
    }


{- See [DocFormat.md](../DocFormat.md) for token meanings. -}
myDateFormat = "%A, %e %B %Y"
formatOriginal = format config myDateFormat
formatReverseMonthName = format configReverseMonthName myDateFormat


{- Time 1407833631161.0 in utc is "2014-08-12 08:53:51.161" -}
testDate1 = Date.fromTime 1407833631161.0


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
      (  "Display String 1 en_au config \""
      ++ (formatOriginal testDate1)  ++ "\". "
      )
    ]
  , div []
    [ text
      (  "Test is date1 Before date2 should be True and is = "
      ++ (formatReverseMonthName testDate1)  ++ "\". "
      )
    ]
  ]
