module Types exposing (..)

import Date exposing (Date)


type Direction
    = Inbound
    | Outbound


type alias Schedule = List Train


type alias Train =
    { scheduledArrival : Date
    , predictedArrival : Date
    }


type alias Routes = List Route
type alias Route =
    { name : String
    , stops : Stops
    , id : String
    }


type alias Stops = List Stop
type alias Stop = String

type alias RouteStop =
    { route : Route
    , stop : Stop
    }


type Loadable a = Loading | Ready a
