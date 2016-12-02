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

view : Model -> Schedule -> Node Msg
view {now} schedule =
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
          ( List.map (trainElement now) schedule )
        )


trainElement : Date -> Train -> Node Msg
trainElement now train =
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
            [ Ui.string (prettyTime train.scheduledDeparture) ]
        , maybePrediction now train
        ]

maybePrediction : Date -> Train -> Node Msg
maybePrediction now model =
    case model.predictedDeparture of
        Nothing -> prediction now model.scheduledDeparture model.scheduledDeparture
        Just predictedDeparture -> prediction now predictedDeparture model.scheduledDeparture

prediction : Date -> Date -> Date -> Node Msg
prediction now predictedDeparture scheduledDeparture =
    let predictionDiff = (Duration.diff predictedDeparture scheduledDeparture)
        minutesLate = predictedMinutesLate predictionDiff
        displayedDeparture
          = if minutesLate == Nothing
              then scheduledDeparture
              else predictedDeparture
    in
        text
            [ Ui.style
              [ Style.color <| predictionColor minutesLate
              ]
            ]
            [ Ui.string <| predictionText now minutesLate displayedDeparture ]


predictionText : Date -> Maybe String -> Date -> String
predictionText now minutesLate predictedDeparture =
    joinMaybe
        [ minutesLate
        , Just <| prettyDuration <| Duration.diff predictedDeparture now
        ]


prettyDuration : Duration.DeltaRecord -> String
prettyDuration {year,month,day,hour,minute} =
    let unitSum = year + month + day + hour + minute in
        if unitSum < 0 then
            "departed"
        else if unitSum == 0 then
            "departing now"
        else if year + month + day > 0 then
            "departs in more than a day"
        else
            joinMaybe
                [ Just "departs in"
                , prettyDurationUnit hour "h"
                , prettyDurationUnit minute "m"
                ]


joinMaybe : List (Maybe String) -> String
joinMaybe = String.join " " << catMaybes


catMaybes : List (Maybe a) -> List a
catMaybes = List.filterMap identity


prettyDurationUnit : Int -> String -> Maybe String
prettyDurationUnit amount unit =
    if amount > 0 then
        Just <| toString amount ++ unit
    else
        Nothing


predictedMinutesLate : Duration.DeltaRecord -> Maybe String
predictedMinutesLate {minute} = prettyDurationUnit minute "m late,"


predictionColor : Maybe String -> String
predictionColor minutesLate =
    case minutesLate of
        Nothing -> Color.darkPurple
        Just _ -> Color.red
