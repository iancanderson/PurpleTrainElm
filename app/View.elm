module View exposing (view)

import NativeUi as Ui exposing (Node)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)

import App.Color as Color
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
        [ directionPicker model.direction
        , schedule model.schedule
        , routeAndStop model
        ]


schedule : Schedule -> Node Msg
schedule trains =
    Elements.view
        []
        ( List.map trainElement trains )


trainElement : Train -> Node Msg
trainElement train =
    Elements.view
        [ Ui.style
            [ Style.flexDirection "row"
            , Style.alignItems "center"
            , Style.backgroundColor "white"
            ]
        ]
        [ text
            [ Ui.style
              [ Style.color Color.darkPurple
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
            [ Ui.string "Inbound" ]
        , text
            [ onPress (ChangeDirection Outbound)
            , Ui.style (directionStyle Outbound direction)
            ]
            [ Ui.string "Outbound" ]
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
    ]


routeAndStop : Model -> Node Msg
routeAndStop model =
    case model.selectedRouteStop of
        Nothing ->
            Elements.view
                []
                [ text [] [ Ui.string "Select your home stop" ]
                , Ui.map StopPickerMsg (StopPicker.view model.routes model.stopPicker)
                ]
        Just routeStop ->
            Elements.view
                  [ Ui.style
                      [ Style.backgroundColor Color.purple
                      , Style.borderRadius 40
                      , Style.height 56
                      , Style.justifyContent "center"
                      , Style.alignItems "center"
                      , Style.width 270
                      , Style.marginBottom 20
                      ]
                  ]
                  [ text
                      [ Ui.style
                          [ Style.color Color.lightGray
                          ]
                      ]
                      [ Ui.string routeStop.stop ]
                  ]
