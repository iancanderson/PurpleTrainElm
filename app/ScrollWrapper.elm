module ScrollWrapper exposing (view)

import NativeUi exposing (Node, Property)
import Native.ScrollWrapper


view : List (Property msg) -> List (Node msg) -> Node msg
view =
    NativeUi.customNode "ScrollWrapper" Native.ScrollWrapper.view
