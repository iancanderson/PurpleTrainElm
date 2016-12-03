module View exposing (view)

import NativeUi as Ui exposing (Node, Property)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Events exposing (..)
import NativeUi.Properties exposing (..)
import Json.Encode
import App.Color as Color
import App.Font as Font
import Model exposing (..)
import Message exposing (..)
import Types exposing (..)
import Update exposing (..)
import DirectionPicker.View as DirectionPicker
import StopPickerButton.View as StopPickerButton
import Schedule.View as Schedule
import ViewHelpers exposing (..)


view : Model -> Node Msg
view model =
    Elements.view
        [ Ui.style
            [ Style.flex 1
            , Style.flexDirection "column"
            , Style.justifyContent "space-between"
            , Style.alignItems "center"
            , Style.backgroundColor Color.darkPurple
            ]
        ]
        (mainView model)


mainView : Model -> List (Node Msg)
mainView model =
    case model.selectedStop of
        Nothing ->
            [ welcomeScreen
            , StopPickerButton.view model
            ]

        Just _ ->
            [ DirectionPicker.view
                [ topSection model Inbound model.inboundSchedule
                , topSection model Outbound model.outboundSchedule
                ]
            , StopPickerButton.view model
            ]


welcomeScreen : Node Msg
welcomeScreen =
    text
        [ Ui.style
            [ Style.color "#301d41"
            , Style.fontFamily Font.hkCompakt
            , Style.textAlign "center"
            , Style.fontWeight "800"
            , Style.marginTop 60
            , Style.fontSize 48
            ]
        ]
        [ Ui.string "Purple Train" ]


topSection : Model -> Direction -> Loadable Schedule -> Node Msg
topSection model direction loadableSchedule =
    Elements.view
        [ Ui.style
            [ Style.flex 1
            , Style.flexDirection "column"
            , Style.alignSelf "stretch"
            ]
        , Ui.property "tabLabel" (Json.Encode.string (directionString direction))
        , key (toString direction)
        ]
        [ scheduleOrLoading model loadableSchedule
        ]


scheduleOrLoading : Model -> Loadable Schedule -> Node Msg
scheduleOrLoading model loadableSchedule =
    case loadableSchedule of
        Loading ->
            Elements.view [] []

        Ready schedule ->
            Schedule.view model schedule


directionString : Direction -> String
directionString direction =
    case direction of
        Inbound ->
            "To Boston"

        Outbound ->
            "From Boston"
