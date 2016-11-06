module View exposing (view)

import NativeUi as Ui exposing (Node)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)

import Model exposing (..)
import Types exposing (..)
import Update exposing (..)
import StopPicker
import StopPicker.View as StopPicker

view : Model -> Node Msg
view model =
    Elements.view
        [ Ui.style
            [ Style.flex 1
            , Style.flexDirection "column"
            , Style.justifyContent "center"
            , Style.alignItems "center"
            ]
        ]
        [ welcomeScreen
        , text [ onPress FetchRoutes ] [ Ui.string "Fetch" ]
        , Ui.map StopPickerMsg (StopPicker.view model)
        ]


welcomeScreen : Node Msg
welcomeScreen =
    Elements.view
        []
        [ text [] [ Ui.string "Select your home station" ]
        ]
