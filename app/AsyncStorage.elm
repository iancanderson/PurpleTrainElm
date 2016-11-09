module AsyncStorage exposing (Error, setItem, getItem)

import Native.AsyncStorage

import Task exposing (Task)

type Error = Error String

setItem : String -> String -> Task Error String
setItem =
  Native.AsyncStorage.setItem

getItem : String -> Task Error (Maybe String)
getItem =
  Native.AsyncStorage.getItem
