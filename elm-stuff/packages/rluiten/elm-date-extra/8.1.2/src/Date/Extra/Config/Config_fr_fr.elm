module Date.Extra.Config.Config_fr_fr exposing (..)

{-| This is the French config for formatting dates.

@docs config

Copyright (c) 2016 Bruno Girin
-}

import Date
import Date.Extra.Config as Config
import Date.Extra.I18n.I_fr_fr as French


{-| Config for fr-fr. -}
config : Config.Config
config =
  { i18n =
      { dayShort = French.dayShort
      , dayName = French.dayName
      , monthShort = French.monthShort
      , monthName = French.monthName
      , dayOfMonthWithSuffix = French.dayOfMonthWithSuffix
      }
  , format =
      { date = "%-d/%m/%Y" -- d/MM/yyyy
      , longDate = "%A, %-d %B %Y" -- dddd, d MMMM yyyy
      , time = "%-I:%M %p" -- h:mm tt
      , longTime = "%-I:%M:%S %p" -- h:mm:ss tt
      , dateTime = "%-d/%m/%Y %-I:%M %p"  -- date + time
      , firstDayOfWeek = Date.Mon
      }
  }
