module ScrollableTabView
    exposing
        ( view
        , initialPage
        , tabBarActiveTextColor
        , tabBarInactiveTextColor
        , tabBarUnderlineStyle
        , tabBarTextStyle
        , tabBarStyle
        )

import NativeUi as NativeUi exposing (Property, Node)
import NativeUi.Style as Style
import Native.ScrollableTabView
import Json.Encode


view : List (Property msg) -> List (Node msg) -> Node msg
view =
    NativeUi.customNode "ScrollableTabView" Native.ScrollableTabView.view


initialPage : Int -> Property msg
initialPage =
    NativeUi.property "initialPage" << Json.Encode.int


tabBarActiveTextColor : String -> Property msg
tabBarActiveTextColor =
    NativeUi.property "tabBarActiveTextColor" << Json.Encode.string


tabBarInactiveTextColor : String -> Property msg
tabBarInactiveTextColor =
    NativeUi.property "tabBarInactiveTextColor" << Json.Encode.string


tabBarUnderlineStyle : List Style.Style -> Property msg
tabBarUnderlineStyle =
    NativeUi.property "tabBarUnderlineStyle" << Style.encode


tabBarTextStyle : List Style.Style -> Property msg
tabBarTextStyle =
    NativeUi.property "tabBarTextStyle" << Style.encode


tabBarStyle : List Style.Style -> Property msg
tabBarStyle =
    NativeUi.property "tabBarStyle" << Style.encode
