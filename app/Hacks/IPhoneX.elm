module Hacks.IPhoneX exposing (isIPhoneX)

import NativeApi.Dimensions exposing (window)
import NativeApi.Platform as Platform exposing (OS(..))

isIPhoneX : Bool
isIPhoneX =
  isIOS && matchesIPhoneXDimensions


isIOS : Bool
isIOS =
  case Platform.os of
    Android -> False
    IOS -> True

matchesIPhoneXDimensions : Bool
matchesIPhoneXDimensions =
    let
        iPhoneXHeight = 812
    in
        window.height == iPhoneXHeight || window.width == iPhoneXHeight
