module App.Maybe exposing (catMaybes)


catMaybes : List (Maybe a) -> List a
catMaybes =
    List.filterMap identity
