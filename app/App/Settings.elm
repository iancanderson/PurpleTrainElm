module App.Settings
    exposing
        ( allKeys
        , dismissedAlertsKey
        , fromDict
        , stopKey
        , stop
        , dismissedAlertIds
        , Settings
        )

import Dict exposing (Dict)
import App.Maybe exposing (join)


type Settings
    = Settings (Dict String (Maybe String))


fromDict : Dict String (Maybe String) -> Settings
fromDict =
    Settings


toDict : Settings -> Dict String (Maybe String)
toDict (Settings dict) =
    dict


allKeys : List String
allKeys =
    [ dismissedAlertsKey
    , stopKey
    ]


dismissedAlertsKey : String
dismissedAlertsKey =
    "dismissed_alert_ids"


stopKey : String
stopKey =
    "stop"


getValue : Settings -> String -> Maybe String
getValue settings key =
    join <| Dict.get key (toDict settings)


stop : Settings -> Maybe String
stop settings =
    getValue settings stopKey


dismissedAlertIds : Settings -> List Int
dismissedAlertIds settings =
    getValue settings dismissedAlertsKey
        |> Maybe.withDefault ""
        |> String.split ","
        |> List.filterMap (Result.toMaybe << String.toInt)
