module StopPicker.Model exposing (..)

import Types exposing (..)


type alias Model =
    { selectedRoute : Maybe Route
    }


initialModel : Model
initialModel =
    { selectedRoute = Nothing
    }
