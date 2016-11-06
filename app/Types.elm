module Types exposing (..)

type alias Station = String


type alias Train =
    { time : String
    , station : Station
    }


type alias Schedule = List Train

type alias Routes = List Route
type alias Route =
    { name : String
    , stops : Stops
    }


type alias Stops = List Stop
type alias Stop = String
