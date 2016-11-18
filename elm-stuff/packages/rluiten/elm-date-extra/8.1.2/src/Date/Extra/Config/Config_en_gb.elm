module Date.Extra.Config.Config_en_gb exposing (..)

{-| This is the UK english config for formatting dates.

@docs config

Copyright (c) 2016 Bruno Girin
-}

import Date
import Date.Extra.Config as Config
import Date.Extra.I18n.I_en_us as English


{-| Config for en-gb. -}
config : Config.Config
config =
  { i18n =
      { dayShort = English.dayShort
      , dayName = English.dayName
      , monthShort = English.monthShort
      , monthName = English.monthName
      , dayOfMonthWithSuffix = English.dayOfMonthWithSuffix
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
