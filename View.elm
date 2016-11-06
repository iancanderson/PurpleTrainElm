module View exposing (view)

import Model exposing (..)
import Update exposing (..)

import NativeUi as Ui exposing (Node)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)

view : Model -> Node Msg
view model =
    Elements.view
        [ Ui.style
            [ Style.flex 1
            , Style.flexDirection "column"
            , Style.justifyContent "center"
            , Style.alignItems "center"
            ]
        ]
        [ maybeUpcomingTrains model
        , text [ onPress FetchRoutes ] [ Ui.string "Fetch" ]
        , stationPicker model
        , routesList model.routes
        ]

routesList : Routes -> Node Msg
routesList routes =
    Elements.view
        [
        ]
        ( List.map (\r -> text [] [ Ui.string r.name ]) routes)

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


stationFilter : Station -> Train -> Maybe (Node Msg)
stationFilter selectedStation train =
    if selectedStation == train.station then
        Just (upcomingTrain train)
    else
        Nothing

maybeUpcomingTrains : Model -> Node Msg
maybeUpcomingTrains model =
    case model.selectedStation of
        Nothing ->
            welcomeScreen
        Just station ->
            upcomingTrains station model.schedule

welcomeScreen : Node Msg
welcomeScreen =
    Elements.view
        []
        [ text [] [ Ui.string "Select your home station" ]
        ]

upcomingTrains : Station -> Schedule -> Node Msg
upcomingTrains selectedStation schedule =
    Elements.view
        [
        ]
        ( List.filterMap (stationFilter selectedStation) schedule)


upcomingTrain : Train -> Node Msg
upcomingTrain train =
    text
        []
        [ Ui.string train.time
        ]
