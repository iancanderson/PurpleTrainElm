module Date.Extra.I18n.I_pl_pl exposing (..)

{-| Polish values for day and month names.

@docs dayShort
@docs dayName
@docs monthShort
@docs monthName
@docs dayOfMonthWithSuffix

Copyright (c) 2016 Bartosz Sokół
-}


import Date exposing (Day (..), Month (..))


{-| Day short name. -}
dayShort : Day -> String
dayShort day =
  case day of
    Mon -> "pon"
    Tue -> "wto"
    Wed -> "śro"
    Thu -> "czw"
    Fri -> "pią"
    Sat -> "sob"
    Sun -> "nie"


{-| Day full name. -}
dayName : Day -> String
dayName day =
  case day of
    Mon -> "poniedziałek"
    Tue -> "wtorek"
    Wed -> "środa"
    Thu -> "czwartek"
    Fri -> "piątek"
    Sat -> "sobota"
    Sun -> "niedziela"


{-| Month short name. -}
monthShort : Month -> String
monthShort month =
  case month of
    Jan -> "sty"
    Feb -> "lut"
    Mar -> "mar"
    Apr -> "kwi"
    May -> "maj"
    Jun -> "cze"
    Jul -> "lip"
    Aug -> "sie"
    Sep -> "wrz"
    Oct -> "paź"
    Nov -> "lis"
    Dec -> "gru"


{-| Month full name. -}
monthName : Month -> String
monthName month =
  case month of
    Jan -> "styczeń"
    Feb -> "luty"
    Mar -> "marzec"
    Apr -> "kwiecień"
    May -> "maj"
    Jun -> "czerwiec"
    Jul -> "lipiec"
    Aug -> "sierpień"
    Sep -> "wrzesień"
    Oct -> "październik"
    Nov -> "listopad"
    Dec -> "grudzień"


{-| This may not do anything in French -}
dayOfMonthWithSuffix : Bool -> Int -> String
dayOfMonthWithSuffix pad day =
  case day of
    _ -> (toString day)
