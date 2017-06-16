module StopPicker.View exposing (view)

import Json.Encode
import NativeApi.Platform as Platform exposing (OS(..))
import NativeUi as Ui exposing (Node, Property, property)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)
import NativeUi.ListView exposing (DataSource, listView)
import App.Color as Color
import App.Font as Font
import Types exposing (..)
import Message exposing (..)


view : DataSource Stop -> Node Msg
view dataSource =
    pickerContainer
        [ pickerHeader "Select home stop"
        , stopOptions dataSource
        , androidBorderRadiusHack
        ]


stopOptions : DataSource Stop -> Node Msg
stopOptions dataSource =
    listView
        dataSource
        stopButton
        [ Ui.style
            [ Style.backgroundColor Color.white
            , Style.borderBottomLeftRadius 10
            , Style.borderBottomRightRadius 10
            , Style.height 252
            ]
        ]


stopButton : Stop -> Node Msg
stopButton stop =
    pickerButton (PickStop stop) stop


pickerHeader : String -> Node Msg
pickerHeader label =
    Elements.view
        [ Ui.style
            [ Style.backgroundColor Color.red
            , Style.borderTopLeftRadius 10
            , Style.borderTopRightRadius 10
            , Style.padding 10
            ]
        ]
        [ text
            [ Ui.style
                [ Style.color Color.white
                , Style.fontFamily Font.hkCompakt
                ]
            ]
            [ Ui.string label ]
        ]


androidBorderRadiusHack : Node Msg
androidBorderRadiusHack =
    let
        styles =
            case Platform.os of
                Android ->
                    [ Style.borderBottomLeftRadius 10
                    , Style.borderBottomRightRadius 10
                    , Style.backgroundColor Color.white
                    , Style.height 10
                    ]

                IOS ->
                    []
    in
        Elements.view
            [ Ui.style styles
            ]
            []


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
