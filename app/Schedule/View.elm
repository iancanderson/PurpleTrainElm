module Schedule.View exposing (view)

import NativeUi as Ui exposing (Node, Property)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Events exposing (..)
import Json.Encode
import Date exposing (Date)
import App.Color as Color
import App.Font as Font
import App.Maybe exposing (..)
import Types exposing (..)
import Message exposing (..)
import Model exposing (..)
import ResponsiveHelpers exposing (scale)
import Schedule.Alerts.View as Alerts


view : Model -> Direction -> Schedule -> Node Msg
view ({ now } as model) direction schedule =
    Elements.view
        []
        (catMaybes
            [ Alerts.view model
            , Just <| nextTrainsView direction now (nextTrains schedule)
            , Just <| laterTrainsView model direction (laterTrains schedule)
            ]
        )


nextTrainsView : Direction -> Date -> Schedule -> Node Msg
nextTrainsView direction now schedule =
    Elements.view
        [ Ui.style
            [ Style.alignSelf "stretch" ]
        ]
        (List.append
            [ text
                [ Ui.style
                    [ Style.backgroundColor Color.white
                    , Style.color Color.lightPurple
                    , Style.fontSize <| scale 9
                    , Style.fontWeight "700"
                    , Style.letterSpacing 0.25
                    , Style.paddingTop <| scale 18
                    , Style.paddingBottom <| scale 3
                    , Style.textAlign "center"
                    ]
                ]
                [ Ui.string "UPCOMING" ]
            ]
            (List.map (nextTrainView direction now) schedule)
        )


laterTrainsView : Model -> Direction -> Schedule -> Node Msg
laterTrainsView ({ now } as model) direction schedule =
    let
        sectionLabel =
            if List.isEmpty schedule then
                ""
            else
                "LATER"
    in
        Elements.view
            [ Ui.style
                [ Style.alignSelf "stretch"
                , Style.alignItems "center"
                ]
            ]
            (List.append
                [ text
                    [ Ui.style
                        [ Style.color Color.lightPurple
                        , Style.fontSize <| scale 9
                        , Style.fontWeight "700"
                        , Style.letterSpacing 0.25
                        , Style.paddingTop <| scale 18
                        , Style.textAlign "center"
                        ]
                    , suppressHighlighting True
                    , onPress <| ReportIssue direction model.selectedStop
                    ]
                    [ Ui.string sectionLabel ]
                ]
                (List.map (laterTrainView now) schedule)
            )


nextTrainView : Direction -> Date -> Train -> Node Msg
nextTrainView direction now train =
    Elements.view
        [ Ui.style
            [ Style.flexDirection "row"
            , Style.alignItems "flex-end"
            , Style.justifyContent "space-between"
            , Style.backgroundColor "white"
            , Style.padding <| scale 20
            , Style.paddingTop <| scale 0
            , Style.height <| scale 85
            , Style.borderBottomWidth 1
            , Style.borderColor Color.lightGray
            ]
        ]
        [ text
            [ Ui.style
                [ Style.color Color.darkPurple
                , Style.fontSize <| scale 36
                , Style.fontWeight "400"
                , Style.marginBottom -1
                , Style.fontFamily Font.roboto
                ]
            ]
            [ Ui.string (prettyTime train.scheduledDeparture) ]
        , nextTrainMetadata direction now train
        ]


nextTrainMetadata : Direction -> Date -> Train -> Node Msg
nextTrainMetadata direction now train =
    Elements.view
        []
        (catMaybes
            [ trainInfo direction train
            , Just (prediction now train)
            , Just (arrival train)
            ]
        )


trainInfo : Direction -> Train -> Maybe (Node Msg)
trainInfo direction train =
    case direction of
        Outbound ->
            outboundTrainInfo train

        Inbound ->
            Nothing


outboundTrainInfo : Train -> Maybe (Node Msg)
outboundTrainInfo train =
    case ( train.track, train.coach, train.status ) of
        ( Just track, _, status ) ->
            Just (trainMetadata <| withStatus ("track " ++ track) status)

        ( _, Just coach, status ) ->
            Just (trainMetadata <| withStatus ("coach " ++ coach) status)

        ( _, _, Just status ) ->
            Just (trainMetadata status)

        _ ->
            Nothing


withStatus : String -> Maybe String -> String
withStatus string maybeStatus =
    case maybeStatus of
        Just status ->
            status ++ ", " ++ string

        Nothing ->
            string


trainMetadata : String -> Node Msg
trainMetadata string =
    trainMetadataWithColor (String.toLower string) Color.darkestGray


trainMetadataWithColor : String -> String -> Node Msg
trainMetadataWithColor string color =
    text
        [ Ui.style
            [ Style.color color
            , Style.marginBottom <| scale 5
            , Style.fontSize <| scale 12
            , Style.textAlign "right"
            ]
        ]
        [ Ui.string <| string ]


laterTrainView : Date -> Train -> Node Msg
laterTrainView now train =
    Elements.view
        [ Ui.style
            [ Style.alignItems "center"
            , Style.paddingTop <| scale 12
            , Style.width 200
            ]
        ]
        [ text
            [ Ui.style
                [ Style.color Color.lightestPurple
                , Style.fontSize <| scale 22
                , Style.fontFamily Font.roboto
                ]
            ]
            [ Ui.string (prettyTime train.scheduledDeparture) ]
        ]


prediction : Date -> Train -> Node Msg
prediction now train =
    let
        predictedDeparture =
            Maybe.withDefault train.scheduledDeparture train.predictedDeparture

        minutesLate =
            predictedMinutesLateText <|
                minutesFrom train.scheduledDeparture predictedDeparture

        predictionString =
            predictionText now minutesLate predictedDeparture
    in
        trainMetadataWithColor predictionString (predictionColor minutesLate)


predictedMinutesLateText : Int -> Maybe String
predictedMinutesLateText minutesLate =
    if minutesLate >= 2 then
        Just <| (toString minutesLate) ++ "m late,"
    else
        Nothing


predictionText : Date -> Maybe String -> Date -> String
predictionText now minutesLate predictedDeparture =
    joinMaybe
        [ minutesLate
        , Just <| prettyDuration <| minutesFrom now predictedDeparture
        ]


minutesFrom : Date -> Date -> Int
minutesFrom fromDate toDate =
    let
        fromMinutes =
            floor <| (Date.toTime fromDate) / 1000 / 60

        toMinutes =
            floor <| (Date.toTime toDate) / 1000 / 60
    in
        toMinutes - fromMinutes


prettyDuration : Int -> String
prettyDuration minutesFromNow =
    if minutesFromNow == 0 then
        "departing now"
    else if minutesFromNow < 0 then
        "departed"
    else if minutesFromNow < 60 then
        "departs in " ++ toString minutesFromNow ++ "m"
    else
        "departs in " ++ toString (minutesFromNow // 60) ++ "h " ++ toString (minutesFromNow % 60) ++ "m"


joinMaybe : List (Maybe String) -> String
joinMaybe =
    String.join " " << catMaybes


predictionColor : Maybe String -> String
predictionColor minutesLate =
    case minutesLate of
        Nothing ->
            Color.darkestGray

        Just _ ->
            Color.red


arrival : Train -> Node Msg
arrival train =
    trainMetadata ("arrives at " ++ arrivalTime train)


arrivalTime : Train -> String
arrivalTime =
    prettyTime << .scheduledArrival


suppressHighlighting : Bool -> Property msg
suppressHighlighting =
    Ui.property "suppressHighlighting" << Json.Encode.bool
