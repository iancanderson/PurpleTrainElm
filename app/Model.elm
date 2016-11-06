module Model exposing (..)

import Set exposing (Set)


type alias Station = String


type alias Train =
    { time : String
    , station : Station
    }


type alias Schedule = List Train


type alias Routes = List Route


type alias Stops = List Stop


type alias Stop = String


type alias Route =
    { name : String
    , stops : Stops
    }


type alias Model =
    { schedule : Schedule
    , selectedStation : Maybe Station
    , routes : List Route
    }


initialModel : Model
initialModel =
    { schedule = initialSchedule
    , selectedStation = Nothing
    , routes = []
    }


initialSchedule : Schedule
initialSchedule =
    [ { time = "1pm", station = "Davis Square" }
    , { time = "2pm", station = "Alewife" }
    , { time = "3pm", station = "Central Square" }
    , { time = "4pm", station = "Downtown Crossing" }
    , { time = "4pm", station = "Alewife" }
    , { time = "5pm", station = "Park St." }
    , { time = "6pm", station = "Park St." }
    ]


stations : Schedule -> List Station
stations schedule =
    List.map .station schedule
    |> Set.fromList
    |> Set.toList
