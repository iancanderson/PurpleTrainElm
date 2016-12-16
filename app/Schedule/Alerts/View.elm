module Schedule.Alerts.View exposing (view)

import Http
import Maybe exposing (..)
import NativeUi as Ui exposing (Node)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Events exposing (..)
import NativeUi.Style as Style
import App.Color as Color
import App.Maybe exposing (..)
import Message exposing (..)
import Model exposing (..)
import Types exposing (..)


view : Model -> Maybe (Node Msg)
view { alertsAreExpanded, alerts, dismissedAlertIds } =
    case alerts of
        Loading ->
            Nothing

        Ready (Err _) ->
            Nothing

        Ready (Ok loadedAlerts) ->
            renderAlerts alertsAreExpanded loadedAlerts dismissedAlertIds


renderAlerts : Bool -> List Alert -> List Int -> Maybe (Node Msg)
renderAlerts alertsAreExpanded allAlerts dismissedAlertIds =
    let
        alerts =
            visibleAlerts allAlerts dismissedAlertIds
    in
        if List.isEmpty alerts then
            Nothing
        else
            Just <|
                Elements.view
                    []
                    (catMaybes
                        [ Just <| alertsBanner alertsAreExpanded <| List.length alerts
                        , maybeExpandedAlerts alertsAreExpanded alerts
                        ]
                    )


alertsBanner : Bool -> Int -> Node Msg
alertsBanner alertsAreExpanded alertCount =
    text
        [ Ui.style
            [ Style.backgroundColor Color.lightGray
            , Style.color Color.red
            , Style.fontSize 9
            , Style.fontWeight "700"
            , Style.letterSpacing 0.25
            , Style.paddingBottom 18
            , Style.paddingTop 18
            , Style.textAlign "center"
            ]
        , onPress ToggleAlerts
        ]
        [ Ui.string <| alertsBannerText alertsAreExpanded alertCount ]


maybeExpandedAlerts : Bool -> Alerts -> Maybe (Node Msg)
maybeExpandedAlerts alertsAreExpanded alerts =
    if alertsAreExpanded then
        Just <|
            Elements.scrollView
                [ Ui.style
                    [ Style.backgroundColor Color.lightGray ]
                ]
                (List.map expandedAlert alerts)
    else
        Nothing


expandedAlert : Alert -> Node Msg
expandedAlert alert =
    Elements.view
        [ Ui.style
            [ Style.borderTopWidth 1
            , Style.borderTopColor Color.darkGray
            , Style.paddingHorizontal 18
            , Style.paddingVertical 18
            ]
        ]
        [ Elements.view
            [ Ui.style
                [ Style.flex 1
                , Style.flexDirection "row"
                , Style.marginBottom 4
                ]
            ]
            [ text
                [ Ui.style
                    [ Style.fontWeight "700"
                    , Style.fontSize 14
                    , Style.flex 1
                    ]
                ]
                [ Ui.string alert.effectName ]
            , Elements.view
                [ Ui.style
                    [ Style.borderWidth 1
                    , Style.borderColor Color.purple
                    , Style.borderRadius 3
                    , Style.padding 2
                    ]
                ]
                [ text
                    [ onPress <| DismissAlert alert
                    , Ui.style
                        [ Style.color Color.purple
                        ]
                    ]
                    [ Ui.string "Dismiss" ]
                ]
            ]
        , text
            []
            [ Ui.string alert.headerText ]
        ]


alertsBannerText : Bool -> Int -> String
alertsBannerText alertsAreExpanded alertCount =
    let
        arrowCharacter =
            if alertsAreExpanded then
                "▲"
            else
                "▼"

        pluralizedDescription =
            if alertCount == 1 then
                "ALERT"
            else
                "ALERTS"
    in
        String.join
            " "
            [ arrowCharacter
            , toString alertCount
            , pluralizedDescription
            , arrowCharacter
            ]
