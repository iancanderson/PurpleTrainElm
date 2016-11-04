module Update exposing (..)

import Model exposing (Station, Model)


type Msg
    = PickStation Station


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PickStation station ->
          ( { model | selectedStation = Just station }, Cmd.none )


