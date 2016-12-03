module ViewHelpers exposing (..)

import NativeUi as Ui exposing (Node, Property)
import Json.Encode


underlayColor : String -> Property msg
underlayColor val =
    Ui.property "underlayColor" (Json.Encode.string val)
