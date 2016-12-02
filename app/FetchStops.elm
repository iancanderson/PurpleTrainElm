module FetchStops exposing (fetchStops)

import Http
import Json.Decode as Decode

import Message exposing (..)
import Types exposing (..)

fetchStops: Cmd Msg
fetchStops =
  Http.send LoadStops getStops


getStops : Http.Request Stops
getStops =
    Http.get
        "https://commuter-api-production.herokuapp.com/api/v2/stops"
        decodeStops


decodeStops : Decode.Decoder Stops
decodeStops = Decode.list decodeStop


decodeStop : Decode.Decoder Stop
decodeStop = Decode.string
