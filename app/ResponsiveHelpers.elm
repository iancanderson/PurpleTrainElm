module ResponsiveHelpers exposing (scale)

import NativeApi.Dimensions exposing (window)


windowHeight : Float
windowHeight =
    window.height


iPhone5Height =
    568


iPhone6Height =
    667


iPhone6PlusHeight =
    736


yRatio : Float
yRatio =
    if windowHeight < iPhone5Height then
        0.7
    else if windowHeight < iPhone6Height then
        0.9
    else if windowHeight < iPhone6PlusHeight then
        1.1
    else
        1.2


scale : Float -> Float
scale input =
    input
        * yRatio
        |> round
        |> toFloat
