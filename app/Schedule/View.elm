module Schedule.View exposing (view)

import NativeUi as Ui exposing (Node, Property)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import Date.Extra.Duration as Duration
import Date exposing (Date)

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
prediction {predictedArrival, scheduledArrival} =
    let predictionDiff = (Duration.diff predictedArrival scheduledArrival)
        minutesLate = predictedMinutesLate predictionDiff
    in
        text
            [ Ui.style
              [ Style.color <| predictionColor minutesLate
              ]
            ]
            [ Ui.string <| predictionText minutesLate predictedArrival ]


predictionText : Maybe String -> Date -> String
predictionText minutesLate predictedArrival =
    String.concat <|
        List.filterMap
        identity
        [minutesLate, (Just <| prettyTime predictedArrival)]

predictedMinutesLate : Duration.DeltaRecord -> Maybe String
predictedMinutesLate {minute} =
  if minute > minutesLateThreshold then
    Just <| toString minute ++ "m late, "
  else
    Nothing

predictionColor : Maybe String -> String
predictionColor minutesLate =
    case minutesLate of
        Nothing -> Color.darkPurple
        Just _ -> Color.red

minutesLateThreshold = 0
