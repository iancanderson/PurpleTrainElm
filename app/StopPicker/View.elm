module StopPicker.View exposing (view)

import Json.Encode
import ScrollWrapper
import NativeUi as Ui exposing (Node, Property, property)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)
import App.Color as Color
import App.Font as Font
import Types exposing (..)
import Message exposing (..)
import ViewHelpers exposing (..)


view : Stops -> Maybe Stop -> Node Msg
view stops highlightStop =
    pickerContainer [ stopOptions stops highlightStop ]


stopOptions : Stops -> Maybe Stop -> Node Msg
stopOptions stops stop =
    pickerOptions <|
        List.map (stopButton stop) stops


stopButton : Maybe Stop -> Stop -> Node Msg
stopButton highlightStop stop =
    case highlightStop of
        Nothing ->
            pickerButton (PickStop stop) stop

        Just pickedStop ->
            if stop == pickedStop then
                highlightPickerButton (PickStop stop) stop
            else
                pickerButton (PickStop stop) stop


pickerOptions : List (Node Msg) -> Node Msg
pickerOptions =
    ScrollWrapper.view
        [ Ui.style
            [ Style.backgroundColor Color.white
            , Style.borderRadius 10
            , Style.borderRadius 10
            , Style.height 252
            ]
        ]


pickerContainer : List (Node Msg) -> Node Msg
pickerContainer =
    Elements.view
        [ Ui.style
            [ Style.width 270
            , Style.position "absolute"
            , Style.bottom 88
            , Style.shadowColor "rgb(49, 33, 64)"
            , Style.shadowOpacity 0.2
            , Style.shadowRadius 3
            , Style.borderRadius 10
            ]
        ]


pickerButton : Msg -> String -> Node Msg
pickerButton message label =
    Elements.touchableHighlight
        [ onPress message
        , underlayColor Color.defaultUnderlay
        , buttonStyle Color.white
        , key label
        ]
        [ Elements.view
            []
            [ text
                [ buttonTextStyle ]
                [ Ui.string label ]
            ]
        ]


highlightPickerButton : Msg -> String -> Node Msg
highlightPickerButton message label =
    Elements.touchableHighlight
        [ onPress message
        , underlayColor Color.defaultUnderlay
        , buttonStyle Color.lighterPurple
        , key label
        , property "scrollTarget" (Json.Encode.bool True)
        ]
        [ Elements.view
            []
            [ text
                [ buttonTextStyle ]
                [ Ui.string label ]
            ]
        ]


buttonStyle : String -> Ui.Property Msg
buttonStyle color =
    Ui.style
        [ Style.height 40
        , Style.padding 12
        , Style.backgroundColor color
        ]


buttonTextStyle : Ui.Property Msg
buttonTextStyle =
    Ui.style
        [ Style.fontFamily Font.hkCompakt
        , Style.fontWeight "400"
        , Style.color Color.darkestPurple
        ]
