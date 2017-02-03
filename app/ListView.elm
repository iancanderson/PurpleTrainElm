module ListView
    exposing
        ( DataSource
        , emptyDataSource
        , view
        , updateDataSource
        , initialListSize
        , pageSize
        , removeClippedSubviews
        , scrollRenderAheadDistance
        )

import Json.Encode
import NativeUi exposing (Property, Node, node, renderProperty, property)
import Native.ListView


type DataSource a
    = DataSource a


view : DataSource a -> (a -> Node msg) -> List (Property msg) -> Node msg
view ds render props =
    node "ListView"
        ((unencodedProperty
            ds
         )
            :: renderRow render
            :: props
        )
        []


renderRow : (a -> Node msg) -> Property msg
renderRow =
    renderProperty "renderRow"


emptyDataSource : DataSource a
emptyDataSource =
    Native.ListView.emptyDataSource


updateDataSource : DataSource a -> List a -> DataSource a
updateDataSource =
    Native.ListView.updateDataSource


unencodedProperty : DataSource a -> Property msg
unencodedProperty =
    Native.ListView.unencodedProperty


initialListSize : Int -> Property msg
initialListSize =
    property "initialListSize" << Json.Encode.int


pageSize : Int -> Property msg
pageSize =
    property "pageSize" << Json.Encode.int


removeClippedSubviews : Bool -> Property msg
removeClippedSubviews =
    property "removeClippedSubviews" << Json.Encode.bool


scrollRenderAheadDistance : Int -> Property msg
scrollRenderAheadDistance =
    property "scrollRenderAheadDistance" << Json.Encode.int
