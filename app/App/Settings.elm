module App.Settings
    exposing
        ( allKeys
        , dismissedAlertsKey
        , fromDict
        , stopKey
        , stop
        , dismissedAlertIds
        , deviceToken
        , promptedForNotifications
        , promptedForNotificationsKey
        )

import Dict exposing (Dict)
import App.Maybe exposing (isSomething, join)
import Types exposing (..)


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
    , deviceTokenKey
    , promptedForNotificationsKey
    ]


dismissedAlertsKey : String
dismissedAlertsKey =
    "dismissed_alert_ids"


stopKey : String
stopKey =
    "stop"


deviceTokenKey : String
deviceTokenKey =
    "deviceToken"


getValue : Settings -> String -> Maybe String
getValue settings key =
    join <| Dict.get key (toDict settings)


stop : Settings -> Maybe Stop
stop settings =
    Maybe.map Stop (getValue settings stopKey)


deviceToken : Settings -> Maybe DeviceToken
deviceToken settings =
    Maybe.map DeviceToken (getValue settings deviceTokenKey)


dismissedAlertIds : Settings -> List Int
dismissedAlertIds settings =
    getValue settings dismissedAlertsKey
        |> Maybe.withDefault ""
        |> String.split ","
        |> List.filterMap (Result.toMaybe << String.toInt)


promptedForNotifications : Settings -> Bool
promptedForNotifications settings =
    isSomething (getValue settings promptedForNotificationsKey)


promptedForNotificationsKey : String
promptedForNotificationsKey =
    "promptedForCancellationsNotifications"
