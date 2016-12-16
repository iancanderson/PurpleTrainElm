module Types exposing (..)

import Date exposing (Date)


type Direction
    = Inbound
    | Outbound


type alias Schedule =
    List Train


type alias Train =
    { scheduledDeparture : Date
    , predictedDeparture : Maybe Date
    , track : Maybe String
    , coach : Maybe String
    , status : Maybe String
    }


type alias Alert =
    { id : Int
    , effectName : String
    , headerText : String
    }


type alias Alerts =
    List Alert


type alias Stops =
    List Stop


type alias Stop =
    String


type Loadable a
    = Loading
    | Ready a
