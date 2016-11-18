module Schedule.View exposing (view)

import NativeUi as Ui exposing (Node, Property)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)

import App.Color as Color
import App.Font as Font
import Types exposing (..)
import Message exposing (..)
import Model exposing (..)

view : Schedule -> Node Msg
view trains =
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
              , Style.fontSize 36
              , Style.fontWeight "400"
              , Style.marginBottom -1
              , Style.fontFamily Font.roboto
              ]
            ]
            [ Ui.string (prettyTime train.scheduledArrival) ]
        , prediction train
        ]


prediction : Train -> Node Msg
prediction train =
      text
          [ Ui.style
            [ Style.color Color.darkPurple
            ]
          ]
          [ Ui.string <| predictionText train ]


predictionText : Train -> String
predictionText {scheduledArrival, predictedArrival} =
    -- let predictedTime = (Date.toTime predictedArrival)
    --     scheduledTime = (Date.toTime scheduledArrival)
    -- in
        prettyTime predictedArrival
