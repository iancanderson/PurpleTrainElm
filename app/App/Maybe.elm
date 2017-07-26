module App.Maybe exposing (catMaybes, isSomething, join, maybeToCommand)

import Message exposing (Msg)


catMaybes : List (Maybe a) -> List a
catMaybes =
    List.filterMap identity


join : Maybe (Maybe a) -> Maybe a
join mx =
    case mx of
        Just x ->
            x

        Nothing ->
            Nothing


maybeToCommand : (a -> Cmd Msg) -> Maybe a -> Cmd Msg
maybeToCommand toCommand m =
    Maybe.map toCommand m
        |> Maybe.withDefault Cmd.none


isSomething : Maybe a -> Bool
isSomething maybe =
    case maybe of
        Just _ ->
            True

        Nothing ->
            False
