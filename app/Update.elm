module Update exposing (..)

import Http
import Debug
import Json.Decode as Decode

import Model exposing (..)

type Msg
    = PickStation Station
    | FetchRoutes
    | LoadRoutes (Result Http.Error Routes)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PickStation station ->
            ( { model | selectedStation = Just station }, Cmd.none )
        FetchRoutes ->
            ( model, send )
        LoadRoutes (Ok routes) ->
            ( { model | routes = routes }, Cmd.none)
        LoadRoutes (Result.Err _) ->
            ( model, send )


getRoutes : Http.Request Routes
getRoutes =
    Http.get
        "https://commuter-api-production.herokuapp.com/api/v1/routes"
        decodeRoutes


decodeRoutes : Decode.Decoder Routes
decodeRoutes =
  Decode.map (List.map snd) (Decode.keyValuePairs decodeRoute)

decodeStops : Decode.Decoder Stops
decodeStops = Decode.list decodeStop


decodeStop : Decode.Decoder Stop
decodeStop = Decode.string

decodeRoute : Decode.Decoder Route
decodeRoute =
  Decode.map2 Route
    (Decode.field "route_name" Decode.string)
    (Decode.field "stops" decodeStops)


send : Cmd Msg
send =
  Http.send LoadRoutes getRoutes
