module Update exposing (..)

import Http
import Json.Decode as Decode

import Model exposing (Station, Model)

type alias Routes = List Route

type alias Route =
    { name : String
    }


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
        LoadRoutes result ->
            ( model, Cmd.none )


getRoutes : Http.Request Routes
getRoutes =
    Http.get
        "https://commuter-api-production.herokuapp.com/api/v1/routes"
        decodeRoutes


decodeRoutes : Decode.Decoder Routes
decodeRoutes =
  Decode.map (List.map snd) (Decode.keyValuePairs decodeRoute)


decodeRoute : Decode.Decoder Route
decodeRoute =
  Decode.map Route
    (Decode.field "route_name" Decode.string)


send : Cmd Msg
send =
  Http.send LoadRoutes getRoutes
