module Date.Extra.I18n.I_fr_fr exposing (..)

{-| French values for day and month names.

@docs dayShort
@docs dayName
@docs monthShort
@docs monthName
@docs dayOfMonthWithSuffix

Copyright (c) 2016 Bruno Girin
-}


import Date exposing (Day (..), Month (..))
import String exposing (padLeft)


{-| Day short name. -}
dayShort : Day -> String
dayShort day =
  case day of
    Mon -> "Lun"
    Tue -> "Mar"
    Wed -> "Mer"
    Thu -> "Jeu"
    Fri -> "Ven"
    Sat -> "Sam"
    Sun -> "Dim"


{-| Day full name. -}
dayName : Day -> String
dayName day =
  case day of
    Mon -> "Lundi"
    Tue -> "Mardi"
    Wed -> "Mercredi"
    Thu -> "Jeudi"
    Fri -> "Vendredi"
    Sat -> "Samedi"
    Sun -> "Dimanche"


{-| Month short name. -}
monthShort : Month -> String
monthShort month =
  case month of
    Jan -> "Jan"
    Feb -> "Fév"
    Mar -> "Mar"
    Apr -> "Avr"
    May -> "Mai"
    Jun -> "Jun"
    Jul -> "Jul"
    Aug -> "Aou"
    Sep -> "Sep"
    Oct -> "Oct"
    Nov -> "Nov"
    Dec -> "Déc"


{-| Month full name. -}
monthName : Month -> String
monthName month =
  case month of
    Jan -> "Janvier"
    Feb -> "Février"
    Mar -> "Mars"
    Apr -> "Avril"
    May -> "Mai"
    Jun -> "Juin"
    Jul -> "Juillet"
    Aug -> "Août"
    Sep -> "Septembre"
    Oct -> "Octobre"
    Nov -> "Novembre"
    Dec -> "Décembre"


{-| Returns a common French idiom for days of month.
Pad indicates space pad the day of month value so single
digit outputs have space padding to make them same
length as double digit days of month.

Note that the French idiom is to use the ordinal number
for the first day of the month (1er janvier) and
cardinal numbers for all other days (15 janvier). This
method doesn't pad the value on the right even if the
`pad` argument is `true`.
-}
dayOfMonthWithSuffix : Bool -> Int -> String
dayOfMonthWithSuffix pad day =
  let
    value =
      case day of
        1 -> "1er"
        _ -> (toString day)
  in
    if pad then
      padLeft 4 ' ' value
    else
      value
