module View exposing (view)

import NativeUi as Ui exposing (Node)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)

import Model exposing (..)
import Message exposing (..)
import Types exposing (..)
import Update exposing (..)
import StopPicker.View as StopPicker

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
        [ directionPicker model.direction
        , schedule model.schedule
        , routeAndStop model
        ]


schedule : Schedule -> Node Msg
schedule trains =
    Elements.view
        []
        ( List.map trainElement trains )


trainElement : Train -> Node Msg
trainElement train =
    Elements.view
        []
        [ text [] [ Ui.string train.scheduledArrival ]
        ]


directionPicker : Direction -> Node Msg
directionPicker direction =
    Elements.view
        []
        [ text
            [ onPress (ChangeDirection Inbound)
            , Ui.style (directionStyle Inbound direction)
            ]
            [ Ui.string "Inbound" ]
        , text
            [ onPress (ChangeDirection Outbound)
            , Ui.style (directionStyle Outbound direction)
            ]
            [ Ui.string "Outbound" ]
        ]


directionStyle : Direction -> Direction -> List Style.Style
directionStyle direction currentDirection =
    if direction == currentDirection then
        [ Style.color "red"
        ]
    else
        []


routeAndStop : Model -> Node Msg
routeAndStop model =
    case model.selectedRouteStop of
        Nothing ->
            Elements.view
                []
                [ text [] [ Ui.string "Select your home stop" ]
                , Ui.map StopPickerMsg (StopPicker.view model.routes model.stopPicker)
                ]
        Just routeStop ->
            Elements.view
                []
                [ text [ ] [ Ui.string ("Route: " ++ routeStop.route.name) ]
                , text [ ] [ Ui.string ("Stop: " ++ routeStop.stop) ]
                ]
