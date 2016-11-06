module StopPicker.Translate exposing (..)

import StopPicker.Update exposing (..)
import Message as App

translate : ExternalMsg -> App.Msg
translate (PickStop stop) = App.PickStop stop
