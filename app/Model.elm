module Model exposing (..)

import Set exposing (Set)

import Types exposing (..)
import StopPicker


type alias Model =
    { routes : Routes
    , stopPicker : StopPicker.Model
    }


initialModel : Model
initialModel =
    { routes = []
    , stopPicker = StopPicker.initialModel
    }
