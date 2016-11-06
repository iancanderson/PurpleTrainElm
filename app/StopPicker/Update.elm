module StopPicker.Update exposing (..)

import Types exposing (..)
import StopPicker.Model exposing (..)

type Msg
    = Internal InternalMsg
    | External ExternalMsg


type ExternalMsg
    = PickStop RouteStop


type InternalMsg
    = PickRoute Route


update : InternalMsg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PickRoute route ->
            ( { model | selectedRoute = Just route }, Cmd.none )
