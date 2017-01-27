module DirectionPicker.View exposing (view)

import NativeUi as Ui exposing (Node, Property)
import NativeUi.Style as Style
import Json.Decode as Decode
import Json.Encode
import App.Color as Color
import App.Font as Font
import Message exposing (..)
import ScrollableTabView exposing (..)


view : List (Node Msg) -> Node Msg
view =
    ScrollableTabView.view
        [ tabBarActiveTextColor Color.white
        , tabBarInactiveTextColor Color.lightHeader
        , tabBarUnderlineStyle
            [ Style.backgroundColor Color.lightHeader
            , Style.height 0
            ]
        , tabBarTextStyle
            [ Style.fontFamily Font.hkCompakt
            , Style.fontWeight "400"
            , Style.fontSize 20
            ]
        , tabBarStyle
            [ Style.borderBottomWidth 0
            ]
        , Ui.style
            [ Style.marginTop 20
            ]
        ]
