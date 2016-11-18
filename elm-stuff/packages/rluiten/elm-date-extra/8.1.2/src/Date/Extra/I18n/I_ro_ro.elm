module Date.Extra.I18n.I_ro_ro exposing (..)

{-| Romanian values for day and month names.

@docs dayShort
@docs dayName
@docs monthShort
@docs monthName
@docs dayOfMonthWithSuffix

Copyright (c) 2016 Cezar Halmagean
-}


import Date exposing (Day (..), Month (..))


{-| Day short name. -}
dayShort : Day -> String
dayShort day =
  case day of
    Mon -> "Lun"
    Tue -> "Mar"
    Wed -> "Mie"
    Thu -> "Joi"
    Fri -> "Vin"
    Sat -> "Sâm"
    Sun -> "Dum"


{-| Day full name. -}
dayName : Day -> String
dayName day =
  case day of
    Mon -> "Luni"
    Tue -> "Marți"
    Wed -> "Miercuri"
    Thu -> "Joi"
    Fri -> "Vineri"
    Sat -> "Sâmbătă"
    Sun -> "Duminică"


{-| Month short name. -}
monthShort : Month -> String
monthShort month =
  case month of
    Jan -> "Ian"
    Feb -> "Feb"
    Mar -> "Mar"
    Apr -> "Apr"
    May -> "Mai"
    Jun -> "Iun"
    Jul -> "Iul"
    Aug -> "Aug"
    Sep -> "Sep"
    Oct -> "Oct"
    Nov -> "Noi"
    Dec -> "Dec"


{-| Month full name. -}
monthName : Month -> String
monthName month =
  case month of
    Jan -> "Ianuarie"
    Feb -> "Februarie"
    Mar -> "Martie"
    Apr -> "Aprilie"
    May -> "Mai"
    Jun -> "Iunie"
    Jul -> "Iulie"
    Aug -> "August"
    Sep -> "Septembrie"
    Oct -> "Octombrie"
    Nov -> "Noiembrie"
    Dec -> "Decembrie"


{-| No suffixes for Romanian -}
dayOfMonthWithSuffix : Bool -> Int -> String
dayOfMonthWithSuffix pad day =
  case day of
    _ -> (toString day)
