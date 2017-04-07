module Types exposing (..)

import Date exposing (Date)
import NativeUi.AsyncStorage as AsyncStorage
import Dict exposing (Dict)


type Direction
    = Inbound
    | Outbound


type alias Schedule =
    List Train


type alias Train =
    { scheduledDeparture : Date
    , scheduledArrival : Date
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


type alias DeviceToken =
    String


type Loadable a
    = Loading
    | Error
    | Ready a


type Settings
    = Settings (Dict String (Maybe String))


type alias SettingsResult =
    Result AsyncStorage.Error Settings
