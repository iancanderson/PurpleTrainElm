module Date.Extra.Config.Config_ro_ro exposing (..)

{-| This is the Romanian config for formatting dates.

@docs config

Copyright (c) 2016 Cezar Halmagean
-}

import Date
import Date.Extra.Config as Config
import Date.Extra.I18n.I_ro_ro as Romanian


{-| Config for ro_ro. -}
config : Config.Config
config =
  { i18n =
      { dayShort = Romanian.dayShort
      , dayName = Romanian.dayName
      , monthShort = Romanian.monthShort
      , monthName = Romanian.monthName
      , dayOfMonthWithSuffix = Romanian.dayOfMonthWithSuffix
      }
  , format =
      { date = "%d.%m.%Y" -- dd.MM.yyyy
      , longDate = "%A, %-d %B %Y" -- dddd, d MMMM yyyy
      , time = "%-H:%M" -- h:mm
      , longTime = "%-H:%M:%S" -- h:mm:ss
      , dateTime = "%-d.%m.%Y %-H:%M"  -- date + time
      , firstDayOfWeek = Date.Mon
      }
  }
