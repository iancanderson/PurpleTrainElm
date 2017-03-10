module FetchAlerts exposing (fetchAlerts)

import Http
import Json.Decode as Decode
import Message exposing (..)
import Types exposing (..)
import Api exposing (..)


fetchAlerts : Stop -> Cmd Msg
fetchAlerts stop =
    Http.send ReceiveAlerts <| getAlerts stop


getAlerts : String -> Http.Request Alerts
getAlerts stopId =
    Http.get
        (baseUrl
            ++ "/api/v2/stops/"
            ++ (Http.encodeUri stopId)
            ++ "/alerts"
        )
        decodeAlerts


decodeAlerts : Decode.Decoder Alerts
decodeAlerts =
    Decode.list decodeAlert


decodeAlert : Decode.Decoder Alert
decodeAlert =
    Decode.map3 Alert
        (Decode.field "alert_id" Decode.int)
        (Decode.field "effect_name" Decode.string)
        (Decode.field "header_text" Decode.string)
