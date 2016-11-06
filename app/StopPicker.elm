module StopPicker exposing (..)

import Types exposing (..)

-- MODEL


type alias Model =
    { selectedRoute : Maybe Route
    }


initialModel : Model
initialModel =
    { selectedRoute = Nothing
    }

-- UPDATE


type Msg
    = PickRoute Route


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PickRoute route ->
            ( { model | selectedRoute = Just route }, Cmd.none )
