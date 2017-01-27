module StopPicker.View exposing (view)

import Json.Encode
import NativeUi as Ui exposing (Node)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)
import App.Color as Color
import App.Font as Font
import Types exposing (..)
import Message exposing (..)
import ViewHelpers exposing (..)


view : Stops -> Node Msg
view stops =
    pickerContainer [ stopOptions stops ]


stopOptions : Stops -> Node Msg
stopOptions stops =
    pickerOptions <|
        List.map stopButton stops


stopButton : Stop -> Node Msg
stopButton stop =
    pickerButton (PickStop stop) stop


pickerOptions : List (Node Msg) -> Node Msg
pickerOptions =
    Elements.scrollView
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
            , Style.bottom 96
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
        , buttonStyle
        , key label
        ]
        [ Elements.view
            []
            [ text
                [ buttonTextStyle ]
                [ Ui.string label ]
            ]
        ]


buttonStyle : Ui.Property Msg
buttonStyle =
    Ui.style
        [ Style.height 40
        , Style.padding 12
        ]


buttonTextStyle : Ui.Property Msg
buttonTextStyle =
    Ui.style
        [ Style.fontFamily Font.hkCompakt
        , Style.fontWeight "400"
        , Style.color Color.purple
        ]
