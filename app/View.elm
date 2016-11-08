module View exposing (view)

import NativeUi as Ui exposing (Node)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)

import App.Color as Color
import App.Font as Font
import Model exposing (..)
import Message exposing (..)
import Types exposing (..)
import Update exposing (..)
import StopPicker.View as StopPicker

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
        [ topSection model
        , routeAndStop model
        ]


topSection : Model -> Node Msg
topSection model =
    Elements.view
        [ Ui.style
            [ Style.flex 1
            , Style.flexDirection "column"
            , Style.alignSelf "stretch"
            ]
        ]
        [ directionPicker model.direction
        , schedule model.schedule
        ]


schedule : Schedule -> Node Msg
schedule trains =
    Elements.view
        [ Ui.style
            [ Style.alignSelf "stretch" ]
        ]
        ( List.append
          [ text
                [ Ui.style
                    [ Style.backgroundColor Color.white
                    , Style.color "#9F8AB3"
                    , Style.fontSize 9
                    , Style.fontWeight "700"
                    , Style.letterSpacing 0.25
                    , Style.paddingTop 18
                    , Style.textAlign "center"
                    ]
                ]
                [ Ui.string "UPCOMING" ] ]
          ( List.map trainElement trains )
        )


trainElement : Train -> Node Msg
trainElement train =
    Elements.view
        [ Ui.style
            [ Style.flexDirection "row"
            , Style.alignItems "center"
            , Style.justifyContent "space-between"
            , Style.backgroundColor "white"
            , Style.padding 20
            , Style.borderBottomWidth 1
            , Style.borderColor Color.lightGray
            ]
        ]
        [ text
            [ Ui.style
              [ Style.color Color.darkPurple
              , Style.fontSize 22
              , Style.fontFamily Font.roboto
              ]
            ]
            [ Ui.string (prettyTime train.scheduledArrival) ]
        , text
            [ Ui.style
              [ Style.color Color.darkPurple
              ]
            ]
            [ Ui.string (prettyTime train.predictedArrival) ]
        ]


directionPicker : Direction -> Node Msg
directionPicker direction =
    Elements.view
        [ Ui.style
            [ Style.flexDirection "row"
            , Style.alignItems "center"
            , Style.alignSelf "stretch"
            , Style.marginTop 20
            ]
        ]
        [ text
            [ onPress (ChangeDirection Inbound)
            , Ui.style (directionStyle Inbound direction)
            ]
            [ Ui.string "To Boston" ]
        , text
            [ onPress (ChangeDirection Outbound)
            , Ui.style (directionStyle Outbound direction)
            ]
            [ Ui.string "From Boston" ]
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
    [ Style.flex 1
    , Style.padding 20
    , Style.textAlign "center"
    , Style.fontFamily Font.hkCompakt
    , Style.fontWeight "400"
    ]


routeAndStop : Model -> Node Msg
routeAndStop model =
  Elements.view
      [ Ui.style
          [ Style.width 270
          ]
      ]
      (picker model)

picker : Model -> List (Node Msg)
picker model =
    case model.selectedRouteStop of
        Nothing ->
            [ stopPicker model ]
        Just routeStop ->
            ( List.filterMap identity [ maybeStopPicker model
            , Just <| stopPickerButton model.stopPickerOpen routeStop.stop
            ]
            )


maybeStopPicker : Model -> Maybe (Node Msg)
maybeStopPicker model =
    if model.stopPickerOpen then
        Just <| stopPicker model
    else
        Nothing


stopPicker : Model -> Node Msg
stopPicker model =
    Ui.map StopPickerMsg (StopPicker.view model.routes model.stopPicker)

stopPickerButton : Bool -> Stop -> Node Msg
stopPickerButton stopPickerOpen stop =
    Elements.view
        [ Ui.style
            [ Style.backgroundColor "#674982"
            , Style.borderRadius 40
            , Style.height 56
            , Style.justifyContent "center"
            , Style.alignItems "center"
            , Style.position "absolute"
            , Style.bottom 20
            , Style.width 270
            ]
        ]
        [ text
            [ Ui.style
                [ Style.color "#C9B8D7"
                , Style.fontFamily Font.hkCompakt
                , Style.fontWeight "500"
                ]
            , onPress ToggleStopPicker
            ]
            [ Ui.string (if stopPickerOpen then "Cancel" else stop) ]
        ]
