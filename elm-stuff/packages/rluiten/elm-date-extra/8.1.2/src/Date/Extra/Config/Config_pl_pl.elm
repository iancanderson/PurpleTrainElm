module Date.Extra.Config.Config_pl_pl exposing (..)

{-| This is the Polish config for formatting dates.

@docs config

Copyright (c) 2016 Bartosz Sokół
-}

import Date
import Date.Extra.Config as Config
import Date.Extra.I18n.I_pl_pl as Polish


{-| Config for pl-pl. -}
config : Config.Config
config =
  { i18n =
      { dayShort = Polish.dayShort
      , dayName = Polish.dayName
      , monthShort = Polish.monthShort
      , monthName = Polish.monthName
      , dayOfMonthWithSuffix = Polish.dayOfMonthWithSuffix
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
