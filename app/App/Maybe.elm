module App.Maybe exposing (catMaybes, join)


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
