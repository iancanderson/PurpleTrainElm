module Date.Extra.Config.Configs exposing
  ( getConfig
  , configs
  )

{-| Get a Date Extra Config based up on a locale code.

@docs getConfig
@docs configs

Copyright (c) 2016 Robin Luiten
-}

import Dict exposing (Dict)
import Regex exposing (replace, regex, HowMany (All))
import String

import Date.Extra.Config as Config exposing (Config)
import Date.Extra.Config.Config_en_us as Config_en_us
import Date.Extra.Config.Config_en_au as Config_en_au
import Date.Extra.Config.Config_en_gb as Config_en_gb
import Date.Extra.Config.Config_fr_fr as Config_fr_fr
import Date.Extra.Config.Config_pl_pl as Config_pl_pl
import Date.Extra.Config.Config_fi_fi as Config_fi_fi
import Date.Extra.Config.Config_ro_ro as Config_ro_ro


{-| Built in configurations. -}
configs : Dict String Config
configs =
  Dict.fromList
    [ ("en_au", Config_en_au.config)
    , ("en_us", Config_en_us.config)
    , ("en_gb", Config_en_gb.config)
    , ("fr_fr", Config_fr_fr.config)
    , ("pl_pl", Config_pl_pl.config)
    , ("fi_fi", Config_fi_fi.config)
    , ("ro_ro", Config_ro_ro.config)
    ]


{-| Get a Date Extra Config for a locale id.

Lower case matches strings and accepts "-" or "_" to seperate
the characters in code.

Returns "en_us" config if it can't find a match in configs.
-}
getConfig : String -> Config
getConfig id =
  let
    lowerId = String.toLower id
    fixedId = replace All (regex "-") (\_ -> "_") lowerId
  in
    Maybe.withDefault Config_en_us.config
      (Dict.get fixedId configs)
