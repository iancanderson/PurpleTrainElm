module Main exposing (..)

import NativeUi as Ui exposing (Node)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)


-- MODEL

type alias Station = String


type alias Train =
    { time : String
    , station : Station
    }


type alias Schedule = List Train


type alias Model =
    Schedule


model : Model
model =
    [ { time = "1pm", station = "Back Bay" }
    , { time = "2pm", station = "Back Bay" }
    , { time = "3pm", station = "Back Bay" }
    , { time = "4pm", station = "Back Bay" }
    , { time = "5pm", station = "Back Bay" }
    , { time = "6pm", station = "Back Bay" }
    ]



-- UPDATE


type Msg
    = Increment
    | Decrement


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model = ( model, Cmd.none )


-- VIEW


view : Model -> Node Msg
view schedule =
    Elements.view
        [ Ui.style [ Style.alignItems "center" ]
        ]
        [ trains schedule
        ]

trains : Schedule -> Node Msg
trains schedule =
    Elements.view
        [
        ]
        ( List.map train schedule )


train : Train -> Node Msg
train train =
    text
        []
        [ Ui.string train.time
        ]


-- PROGRAM


main : Program Never Model Msg
main =
    Ui.program
        { init = ( model, Cmd.none )
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }
