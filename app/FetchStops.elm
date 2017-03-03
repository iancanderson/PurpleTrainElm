module FetchStops exposing (fetchStops)

import Http
import Json.Decode as Decode
import Message exposing (..)
import Types exposing (..)
import Api exposing (..)


fetchStops : Cmd Msg
fetchStops =
    Http.send ReceiveStops getStops


getStops : Http.Request Stops
getStops =
    Http.get
        (baseUrl ++ "/api/v2/stops")
        decodeStops


decodeStops : Decode.Decoder Stops
decodeStops =
    Decode.list decodeStop


decodeStop : Decode.Decoder Stop
decodeStop =
    Decode.string
