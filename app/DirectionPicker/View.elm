module DirectionPicker.View exposing (view)

import NativeUi as Ui exposing (Node, Property)
import NativeApi.Platform as Platform exposing (OS(..))
import NativeUi.Style as Style
import Date exposing (Date)
import App.Color as Color
import App.Font as Font
import Message exposing (..)
import ScrollableTabView exposing (..)
import Model exposing (Model)


topMargin : Float
topMargin =
    case Platform.os of
        Android ->
            10

        IOS ->
            20


view : Model -> List (Node Msg) -> Node Msg
view { now } =
    ScrollableTabView.view
        [ initialPage <| getInitialPageIndex now
        , tabBarActiveTextColor Color.white
        , tabBarInactiveTextColor Color.lightPurple
        , tabBarUnderlineStyle
            [ Style.backgroundColor Color.lightPurple
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
            [ Style.marginTop topMargin
            ]
        ]


getInitialPageIndex : Date -> Int
getInitialPageIndex date =
    let
        inboundTabIndex =
            0

        outboundTabIndex =
            1
    in
        if isTimeToGoHome date then
            outboundTabIndex
        else
            inboundTabIndex


isTimeToGoHome : Date -> Bool
isTimeToGoHome date =
    Date.hour date >= 13
