module Date.Extra.I18n.I_en_us exposing (..)

{-| English values for day and month names.

@docs dayShort
@docs dayName
@docs monthShort
@docs monthName
@docs dayOfMonthWithSuffix

Copyright (c) 2016 Robin Luiten
-}


import Date exposing (Day (..), Month (..))
import String exposing (padLeft)


{-| Day short name. -}
dayShort : Day -> String
dayShort day =
  case day of
    Mon -> "Mon"
    Tue -> "Tue"
    Wed -> "Wed"
    Thu -> "Thu"
    Fri -> "Fri"
    Sat -> "Sat"
    Sun -> "Sun"


{-| Day full name. -}
dayName : Day -> String
dayName day =
  case day of
    Mon -> "Monday"
    Tue -> "Tuesday"
    Wed -> "Wednesday"
    Thu -> "Thursday"
    Fri -> "Friday"
    Sat -> "Saturday"
    Sun -> "Sunday"


{-| Month short name. -}
monthShort : Month -> String
monthShort month =
  case month of
    Jan -> "Jan"
    Feb -> "Feb"
    Mar -> "Mar"
    Apr -> "Apr"
    May -> "May"
    Jun -> "Jun"
    Jul -> "Jul"
    Aug -> "Aug"
    Sep -> "Sep"
    Oct -> "Oct"
    Nov -> "Nov"
    Dec -> "Dec"


{-| Month full name. -}
monthName : Month -> String
monthName month =
  case month of
    Jan -> "January"
    Feb -> "February"
    Mar -> "March"
    Apr -> "April"
    May -> "May"
    Jun -> "June"
    Jul -> "July"
    Aug -> "August"
    Sep -> "September"
    Oct -> "October"
    Nov -> "November"
    Dec -> "December"


{-| Returns a common english idiom for days of month.
Pad indicates space pad the day of month value so single
digit outputs have space padding to make them same
length as double digit days of monnth.
-}
dayOfMonthWithSuffix : Bool -> Int -> String
dayOfMonthWithSuffix pad day =
  let
    value =
      case day of
        1 -> "1st"
        21 -> "21st"
        2 -> "2nd"
        22 -> "22nd"
        3 -> "3rd"
        23 -> "23rd"
        31 -> "31st"
        _ -> (toString day) ++ "th"
  in
    if pad then
      padLeft 4 ' ' value
    else
      value
