module Schedule.View exposing (view)

import NativeUi as Ui exposing (Node, Property)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import Date.Extra.Duration as Duration
import Date exposing (Date)
import App.Color as Color
import App.Font as Font
import App.Maybe exposing (..)
import Types exposing (..)
import Message exposing (..)
import Model exposing (..)


view : Model -> Direction -> Schedule -> Node Msg
view { now } direction schedule =
    Elements.view
        []
        [ nextTrainsView direction now (nextTrains schedule)
        , laterTrainsView now (laterTrains schedule)
        ]


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
                    , Style.color Color.lightHeader
                    , Style.fontSize 9
                    , Style.fontWeight "700"
                    , Style.letterSpacing 0.25
                    , Style.paddingTop 18
                    , Style.textAlign "center"
                    ]
                ]
                [ Ui.string "UPCOMING" ]
            ]
            (List.map (nextTrainView direction now) schedule)
        )


laterTrainsView : Date -> Schedule -> Node Msg
laterTrainsView now schedule =
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
                        [ Style.color Color.lightHeader
                        , Style.fontSize 9
                        , Style.fontWeight "700"
                        , Style.letterSpacing 0.25
                        , Style.paddingTop 18
                        , Style.textAlign "center"
                        ]
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
        , nextTrainMetadata direction now train
        ]


nextTrainMetadata : Direction -> Date -> Train -> Node Msg
nextTrainMetadata direction now train =
    Elements.view []
        [ maybeVehicleInfo direction train
        , maybePrediction now train
        ]


maybeVehicleInfo : Direction -> Train -> Node Msg
maybeVehicleInfo direction train =
    case ( direction, train.track, train.coach ) of
        ( Outbound, Just track, _ ) ->
            trackMetadata track

        ( Outbound, _, Just coach ) ->
            coachMetadata coach

        ( _, _, _ ) ->
            Elements.view [] []


coachMetadata : String -> Node Msg
coachMetadata coach =
    Elements.view
        []
        [ nextTrainMetadataRow ("coach " ++ coach) ]


trackMetadata : String -> Node Msg
trackMetadata track =
    Elements.view
        []
        [ nextTrainMetadataRow ("track " ++ track) ]


nextTrainMetadataRowWithColor : String -> String -> Node Msg
nextTrainMetadataRowWithColor string color =
    text
        [ Ui.style
            [ Style.color color
            , Style.marginBottom 5
            , Style.fontSize 12
            , Style.textAlign "right"
            ]
        ]
        [ Ui.string <| string ]


nextTrainMetadataRow : String -> Node Msg
nextTrainMetadataRow string =
    nextTrainMetadataRowWithColor string Color.onTimePredictionText


laterTrainView : Date -> Train -> Node Msg
laterTrainView now train =
    Elements.view
        [ Ui.style
            [ Style.alignItems "center"
            , Style.paddingTop 12
            , Style.width 200
            ]
        ]
        [ text
            [ Ui.style
                [ Style.color Color.laterTrainText
                , Style.fontSize 22
                , Style.fontFamily Font.roboto
                ]
            ]
            [ Ui.string (prettyTime train.scheduledDeparture) ]
        ]


maybePrediction : Date -> Train -> Node Msg
maybePrediction now model =
    case model.predictedDeparture of
        Nothing ->
            prediction now model.scheduledDeparture model.scheduledDeparture

        Just predictedDeparture ->
            prediction now predictedDeparture model.scheduledDeparture


prediction : Date -> Date -> Date -> Node Msg
prediction now predictedDeparture scheduledDeparture =
    let
        predictionDiff =
            (Duration.diff predictedDeparture scheduledDeparture)

        minutesLate =
            predictedMinutesLate predictionDiff

        displayedDeparture =
            if minutesLate == Nothing then
                scheduledDeparture
            else
                predictedDeparture

        predictionString =
            predictionText now minutesLate displayedDeparture
    in
        nextTrainMetadataRowWithColor predictionString (predictionColor minutesLate)


predictionText : Date -> Maybe String -> Date -> String
predictionText now minutesLate predictedDeparture =
    joinMaybe
        [ minutesLate
        , Just <| prettyDuration <| Duration.diff predictedDeparture now
        ]


prettyDuration : Duration.DeltaRecord -> String
prettyDuration { year, month, day, hour, minute } =
    let
        unitSum =
            year + month + day + hour + minute
    in
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
joinMaybe =
    String.join " " << catMaybes


prettyDurationUnit : Int -> String -> Maybe String
prettyDurationUnit amount unit =
    if amount > 0 then
        Just <| toString amount ++ unit
    else
        Nothing


predictedMinutesLate : Duration.DeltaRecord -> Maybe String
predictedMinutesLate { minute } =
    prettyDurationUnit minute "m late,"


predictionColor : Maybe String -> String
predictionColor minutesLate =
    case minutesLate of
        Nothing ->
            Color.onTimePredictionText

        Just _ ->
            Color.red
