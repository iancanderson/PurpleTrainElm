module View exposing (view)

import NativeUi as Ui exposing (Node, Property)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import Http
import Json.Encode
import App.Color as Color
import App.Font as Font
import App.Maybe exposing (..)
import Model exposing (..)
import Message exposing (..)
import Types exposing (..)
import DirectionPicker.View as DirectionPicker
import StopPickerButton.View as StopPickerButton
import Schedule.View as Schedule


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
            let
                maybeStopPickerButton =
                    if model.alertsAreExpanded then
                        Nothing
                    else
                        Just <| StopPickerButton.view model
            in
                catMaybes
                    [ Just <|
                        DirectionPicker.view
                            model
                            [ topSection model Inbound model.inboundSchedule
                            , topSection model Outbound model.outboundSchedule
                            ]
                    , maybeStopPickerButton
                    ]


welcomeScreen : Node Msg
welcomeScreen =
    text
        [ Ui.style
            [ Style.color Color.darkestPurple
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
        [ scheduleOrLoading model direction loadableSchedule
        ]


scheduleOrLoading : Model -> Direction -> Loadable Schedule -> Node Msg
scheduleOrLoading model direction loadableSchedule =
    case loadableSchedule of
        Loading ->
            Elements.view
                [ Ui.style
                    [ Style.flex 1
                    , Style.flexDirection "column"
                    , Style.alignSelf "stretch"
                    , Style.justifyContent "center"
                    ]
                ]
                [ Elements.activityIndicator
                    [ Ui.style [ Style.alignSelf "stretch" ] ]
                    []
                ]

        Error ->
            Elements.view
                [ Ui.style
                    [ Style.flex 1
                    , Style.flexDirection "column"
                    , Style.justifyContent "center"
                    ]
                ]
                [ text
                    [ Ui.style
                        [ Style.backgroundColor Color.white
                        , Style.borderRadius 10
                        , Style.padding 20
                        , Style.margin 20
                        , Style.textAlign "center"
                        , Style.fontSize 20
                        , Style.color Color.red
                        ]
                    ]
                    [ Ui.string "Error while connecting to server" ]
                ]

        Ready schedule ->
            Schedule.view model direction schedule


directionString : Direction -> String
directionString direction =
    case direction of
        Inbound ->
            "To Boston"

        Outbound ->
            "From Boston"
