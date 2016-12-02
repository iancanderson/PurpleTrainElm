module StopPicker.View exposing (view)

import Json.Encode
import NativeUi as Ui exposing (Node)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)

import App.Color as Color
import App.Font as Font
import StopPicker.Model exposing (..)
import StopPicker.Update exposing (..)
import Types exposing (..)
import ViewHelpers exposing (..)

view : Routes -> Model -> Node Msg
view routes model =
    case model.selectedRoute of
        Just route -> stopPicker route
        Nothing -> routePicker routes


stopPicker : Route -> Node Msg
stopPicker route =
  pickerContainer
      [ pickerHeader (route.name ++ " Stops")
      , stopOptions route
      ]


stopOptions : Route -> Node Msg
stopOptions route =
  pickerOptions
      ( List.map (stopButton route) route.stops)


stopButton : Route -> Stop -> Node Msg
stopButton route stop =
    pickerButton (Internal (InternalPickStop (RouteStop route stop))) stop


pickerOptions : List (Node Msg) -> Node Msg
pickerOptions =
    Elements.scrollView
        [ Ui.style
            [ Style.backgroundColor Color.white
            , Style.borderBottomLeftRadius 10
            , Style.borderBottomRightRadius 10
            , Style.height 300
            ]
        ]


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


routePicker : Routes -> Node Msg
routePicker routes =
    pickerContainer
        [ pickerHeader "Commuter Line"
        , routeOptions routes
        ]

routeOptions : Routes -> Node Msg
routeOptions routes =
   pickerOptions
        ( List.map routeButton routes)


routeButton : Route -> Node Msg
routeButton route =
    pickerButton (Internal (PickRoute route)) route.name


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
