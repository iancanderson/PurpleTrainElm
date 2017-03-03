module FetchAlertsAndSchedules exposing (..)

import FetchAlerts exposing (fetchAlerts)
import FetchSchedule exposing (fetchSchedule)
import Message exposing (..)
import Types exposing (..)


fetchAlertsAndSchedules : Stop -> Cmd Msg
fetchAlertsAndSchedules stop =
    Cmd.batch
        [ fetchSchedule Inbound stop
        , fetchSchedule Outbound stop
        , fetchAlerts stop
        ]
