module FetchSchedule exposing (fetchSchedule)

import Http
import Date exposing (Date)
import Json.Decode as Decode
import Message exposing (..)
import Types exposing (..)
import Api exposing (..)


fetchSchedule : Direction -> Stop -> Cmd Msg
fetchSchedule direction stop =
    Http.send (ReceiveSchedule direction) (getSchedule direction stop)


getSchedule : Direction -> Stop -> Http.Request Schedule
getSchedule direction stop =
    Http.get
        (baseUrl
            ++ "/api/v2/stops/"
            ++ (Http.encodeUri stop)
            ++ "/"
            ++ toString direction
            ++ "/trips"
        )
        decodeSchedule


decodeSchedule : Decode.Decoder Schedule
decodeSchedule =
    Decode.list decodeTrain


decodeTrain : Decode.Decoder Train
decodeTrain =
    Decode.map6 Train
        (Decode.field "scheduled_departure_utc" stringToDate)
        (Decode.field "scheduled_arrival_utc" stringToDate)
        (Decode.maybe (Decode.field "predicted_departure_utc" stringToDate))
        (Decode.maybe (Decode.field "track" Decode.string))
        (Decode.maybe (Decode.field "coach_number" Decode.string))
        (Decode.maybe (Decode.field "status" Decode.string))


stringToDate : Decode.Decoder Date
stringToDate =
    Decode.string
        |> Decode.andThen
            (\val ->
                case Date.fromString val of
                    Err err ->
                        Decode.fail err

                    Ok date ->
                        Decode.succeed date
            )
