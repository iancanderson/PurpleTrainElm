-- copied from https://github.com/mgold/elm-date-format


module Date.Format exposing (format, formatISO8601)

{-| Format strings for dates.
@docs format, formatISO8601
-}

import Date
import Regex
import String exposing (padLeft, right)
import Maybe exposing (andThen, withDefault)
import List exposing (head, tail)


re : Regex.Regex
re =
    Regex.regex "%(%|Y|y|m|B|b|d|e|a|A|H|k|I|l|p|P|M|S)"


{-| Use a format string to format a date. See the
[README](https://github.com/mgold/elm-date-format/blob/master/README.md) for a
list of accepted formatters.
-}
format : String -> Date.Date -> String
format s d =
    Regex.replace Regex.All re (formatToken d) s


{-| Formats a UTC date acording to
[ISO-8601](https://en.wikipedia.org/wiki/ISO_8601). This is commonly used to
send dates to a server. For example: `2016-01-06T09:22:00Z`.
-}
formatISO8601 : Date.Date -> String
formatISO8601 =
    format "%Y-%m-%dT%H:%M:%SZ"


formatToken : Date.Date -> Regex.Match -> String
formatToken d m =
    let
        symbol =
            case m.submatches of
                [ Just x ] ->
                    x

                _ ->
                    " "
    in
        case symbol of
            "%" ->
                "%"

            "Y" ->
                d |> Date.year |> toString

            "y" ->
                d |> Date.year |> toString |> right 2

            "m" ->
                d |> Date.month |> monthToInt |> toString |> padLeft 2 '0'

            "B" ->
                d |> Date.month |> monthToFullName

            "b" ->
                d |> Date.month |> toString

            "d" ->
                d |> Date.day |> padWith '0'

            "e" ->
                d |> Date.day |> padWith ' '

            "a" ->
                d |> Date.dayOfWeek |> toString

            "A" ->
                d |> Date.dayOfWeek |> fullDayOfWeek

            "H" ->
                d |> Date.hour |> padWith '0'

            "k" ->
                d |> Date.hour |> padWith ' '

            "I" ->
                d |> Date.hour |> mod12 |> zero2twelve |> padWith '0'

            "l" ->
                d |> Date.hour |> mod12 |> zero2twelve |> padWith ' '

            "p" ->
                if Date.hour d < 12 then
                    "AM"
                else
                    "PM"

            "P" ->
                if Date.hour d < 12 then
                    "am"
                else
                    "pm"

            "M" ->
                d |> Date.minute |> padWith '0'

            "S" ->
                d |> Date.second |> padWith '0'

            _ ->
                ""


monthToInt m =
    case m of
        Date.Jan ->
            1

        Date.Feb ->
            2

        Date.Mar ->
            3

        Date.Apr ->
            4

        Date.May ->
            5

        Date.Jun ->
            6

        Date.Jul ->
            7

        Date.Aug ->
            8

        Date.Sep ->
            9

        Date.Oct ->
            10

        Date.Nov ->
            11

        Date.Dec ->
            12


monthToFullName m =
    case m of
        Date.Jan ->
            "January"

        Date.Feb ->
            "February"

        Date.Mar ->
            "March"

        Date.Apr ->
            "April"

        Date.May ->
            "May"

        Date.Jun ->
            "June"

        Date.Jul ->
            "July"

        Date.Aug ->
            "August"

        Date.Sep ->
            "September"

        Date.Oct ->
            "October"

        Date.Nov ->
            "November"

        Date.Dec ->
            "December"


fullDayOfWeek dow =
    case dow of
        Date.Mon ->
            "Monday"

        Date.Tue ->
            "Tuesday"

        Date.Wed ->
            "Wednesday"

        Date.Thu ->
            "Thursday"

        Date.Fri ->
            "Friday"

        Date.Sat ->
            "Saturday"

        Date.Sun ->
            "Sunday"


mod12 h =
    h % 12


zero2twelve n =
    if n == 0 then
        12
    else
        n


padWith : Char -> a -> String
padWith c =
    padLeft 2 c << toString
