module StopPickerButton.View exposing (view)

import NativeUi as Ui exposing (Node)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)
import NativeUi.ListView exposing (DataSource)
import App.Color as Color
import App.Font as Font
import App.Maybe exposing (..)
import Model exposing (..)
import Types exposing (..)
import Message exposing (..)
import StopPicker.View as StopPicker


view : Model -> Node Msg
view model =
    Elements.view
        [ Ui.style
            [ Style.width 270
            ]
        ]
        (picker model)


picker : Model -> List (Node Msg)
picker model =
    case model.stopPickerDataSource of
        Loading ->
            [ loadingButton ]

        Error ->
            [ pickerError ]

        Ready dataSource ->
            catMaybes
                [ maybeStopPicker model dataSource
                , Just <| stopPickerButton <| stopPickerLabelText model
                ]


pickerError : Node Msg
pickerError =
    Elements.view
        [ Ui.style
            [ Style.backgroundColor Color.red
            , Style.borderRadius 40
            , Style.height 56
            , Style.justifyContent "center"
            , Style.alignItems "center"
            , Style.position "absolute"
            , Style.bottom 20
            , Style.width 270
            ]
        , underlayColor Color.purple
        ]
        [ text
            [ Ui.style
                [ Style.color Color.white
                , Style.fontFamily Font.hkCompakt
                , Style.fontWeight "500"
                ]
            ]
            [ Ui.string "Error connecting to server" ]
        ]


stopPickerLabelText : Model -> String
stopPickerLabelText { stopPickerOpen, selectedStop } =
    case ( stopPickerOpen, selectedStop ) of
        ( True, _ ) ->
            "Cancel"

        ( _, Nothing ) ->
            "Select your home stop"

        ( _, Just stop ) ->
            stop


maybeStopPicker : Model -> DataSource Stop -> Maybe (Node Msg)
maybeStopPicker model dataSource =
    if model.stopPickerOpen then
        Just <| StopPicker.view dataSource
    else
        Nothing


stopPickerButton : String -> Node Msg
stopPickerButton buttonLabel =
    Elements.touchableOpacity
        [ buttonStyles
        , onPress ToggleStopPicker
        , activeOpacity 0.7
        ]
        [ text
            [ Ui.style
                [ Style.color Color.lighterPurple
                , Style.fontFamily Font.hkCompakt
                , Style.fontWeight "500"
                ]
            ]
            [ Ui.string buttonLabel ]
        ]


loadingButton : Node Msg
loadingButton =
    Elements.touchableOpacity
        [ buttonStyles
        , activeOpacity 0.7
        ]
        [ Elements.activityIndicator
            [ Ui.style [ Style.alignSelf "stretch" ] ]
            []
        ]


buttonStyles : Ui.Property Msg
buttonStyles =
    Ui.style
        [ Style.backgroundColor Color.purple
        , Style.borderRadius 40
        , Style.height 56
        , Style.justifyContent "center"
        , Style.alignItems "center"
        , Style.position "absolute"
        , Style.bottom 20
        , Style.width 270
        ]
