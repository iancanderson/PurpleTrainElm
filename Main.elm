module Main exposing (..)

import NativeUi as Ui exposing (Node)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)
import Set exposing (Set)


-- MODEL

type alias Station = String


type alias Train =
    { time : String
    , station : Station
    }


type alias Schedule = List Train


type alias Model =
    { schedule : Schedule
    , selectedStation : Maybe Station
    }


model : Model
model =
    { schedule = initialSchedule
    , selectedStation = Nothing
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


-- UPDATE


type Msg
    = PickStation Station


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PickStation station ->
          ( { model | selectedStation = Just station }, Cmd.none )


-- VIEW


view : Model -> Node Msg
view model =
    Elements.view
        [ Ui.style [ Style.alignItems "center" ]
        ]
        [ upcomingTrains model
        , stationPicker model
        ]

stationStyle : Maybe Station -> Station -> List Style.Style
stationStyle selectedStation station =
    if selectedStation == Just station then
        [ Style.color "red"
        ]
    else
        []

stationButton : Maybe Station -> Station -> Node Msg
stationButton selectedStation station =
    text
      [ Ui.style <| stationStyle selectedStation station
      , onPress (PickStation station)
      ]
      [ Ui.string station ]

stationPicker : Model -> Node Msg
stationPicker {schedule, selectedStation} =
    Elements.view
        []
        ( List.map (stationButton selectedStation) <| stations schedule )


stationFilter : Maybe Station -> Train -> Maybe (Node Msg)
stationFilter selectedStation train =
    case selectedStation of
        Nothing -> Just (upcomingTrain train)
        Just station ->
            if station == train.station then
                Just (upcomingTrain train)
            else
                Nothing

upcomingTrains : Model -> Node Msg
upcomingTrains model =
    Elements.view
        [
        ]
        ( List.filterMap (stationFilter model.selectedStation) model.schedule)


upcomingTrain : Train -> Node Msg
upcomingTrain train =
    text
        []
        [ Ui.string train.time
        ]


-- PROGRAM


main : Program Never Model Msg
main =
    Ui.program
        { init = ( model, Cmd.none )
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }
