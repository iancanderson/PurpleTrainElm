module StopPickerButton.View exposing (view)

import NativeUi as Ui exposing (Node)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)

import App.Color as Color
import App.Font as Font
import Model exposing (..)
import Types exposing (..)
import Message exposing (..)
import StopPicker.View as StopPicker
import ViewHelpers exposing (..)

view : Model  -> Node Msg
view model =
  Elements.view
      [ Ui.style
          [ Style.width 270
          ]
      ]
      (picker model)


picker : Model -> List (Node Msg)
picker model =
    let buttonLabel = stopPickerLabelText model
    in
        List.filterMap
          identity
          [ maybeStopPicker model
          , Just <| stopPickerButton buttonLabel
          ]


stopPickerLabelText : Model -> String
stopPickerLabelText {stopPickerOpen, selectedStop} =
    case (stopPickerOpen, selectedStop) of
      (True, _) -> "Cancel"
      (_, Nothing) -> "Select your home stop"
      (_, Just stop) -> stop


maybeStopPicker : Model -> Maybe (Node Msg)
maybeStopPicker model =
    if model.stopPickerOpen then
        Just <| stopPicker model
    else
        Nothing


stopPicker : Model -> Node Msg
stopPicker model =
    case model.stops of
        Loading-> Elements.view [] []
        Ready stops -> StopPicker.view stops

stopPickerButton : String -> Node Msg
stopPickerButton buttonLabel =
    Elements.touchableHighlight
        [ Ui.style
            [ Style.backgroundColor Color.stopPickerButton
            , Style.borderRadius 40
            , Style.height 56
            , Style.justifyContent "center"
            , Style.alignItems "center"
            , Style.position "absolute"
            , Style.bottom 20
            , Style.width 270
            ]
        , onPress ToggleStopPicker
        , underlayColor Color.stopPickerButton
        ]
        [ text
            [ Ui.style
                [ Style.color "#C9B8D7"
                , Style.fontFamily Font.hkCompakt
                , Style.fontWeight "500"
                ]
            ]
            [ Ui.string buttonLabel ]
        ]
