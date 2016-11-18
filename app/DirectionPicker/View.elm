module DirectionPicker.View exposing (view)

import NativeUi as Ui exposing (Node, Property)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Events exposing (..)

import App.Color as Color
import App.Font as Font
import Types exposing (..)
import Message exposing (..)
import Model exposing (..)
import ViewHelpers exposing (..)

view : Direction -> Node Msg
view direction =
    Elements.view
        [ Ui.style
            [ Style.flexDirection "row"
            , Style.alignItems "center"
            , Style.alignSelf "stretch"
            , Style.marginTop 20
            ]
        ]
        [ directionButton direction Inbound "To Boston"
        , directionButton direction Outbound "From Boston"
        ]


directionButton : Direction -> Direction -> String -> Node Msg
directionButton currentDirection direction label =
    Elements.touchableHighlight
        [ onPress (ChangeDirection direction)
        , underlayColor Color.darkPurple
        , Ui.style
            [ Style.flex 1
            , Style.padding 20
            ]
        ]
        [ text
            [ Ui.style (directionStyle currentDirection direction)
            ]
            [ Ui.string label ]
        ]


directionStyle : Direction -> Direction -> List Style.Style
directionStyle direction currentDirection =
    let activeStyle =
        if direction == currentDirection then
            [ Style.color Color.white
            ]
        else
            [ Style.color Color.lightHeader
            ]
    in
        List.append defaultDirectionStyle activeStyle


defaultDirectionStyle : List Style.Style
defaultDirectionStyle =
    [ Style.textAlign "center"
    , Style.fontFamily Font.hkCompakt
    , Style.fontWeight "400"
    , Style.fontSize 20
    ]
