module Date.Extra.ConfigTests exposing (..)

import Date exposing (Date)
import Test exposing (..)
import Expect

import Date.Extra.Config.Config_en_au as Config_en_au
import Date.Extra.Config.Config_en_us as Config_en_us
import Date.Extra.Config.Config_fr_fr as Config_en_gb
import Date.Extra.Config.Config_fr_fr as Config_fr_fr
import Date.Extra.Config.Config_pl_pl as Config_pl_pl
import Date.Extra.Config.Config_ro_ro as Config_ro_ro
import Date.Extra.Config.Configs as Configs


config_en_au = Config_en_au.config
config_en_us = Config_en_us.config
config_en_gb = Config_en_gb.config
config_fr_fr = Config_fr_fr.config
config_pl_pl = Config_pl_pl.config
config_ro_ro = Config_ro_ro.config


tests : Test
tests =
  describe "Date.Config tests"
    [ test "getConfig en_au" <|
        \() ->
          Expect.equal
            config_en_au.format
            (Configs.getConfig "en_au").format
    , test "getConfig en-AU" <|
        \() ->
          Expect.equal
            config_en_au.format
            (Configs.getConfig "en-AU").format
    , test "getConfig en-au" <|
        \() ->
          Expect.equal
            config_en_au.format
            (Configs.getConfig "en-au").format
    , test "getConfig anything returns en_us" <|
        \() ->
          Expect.equal
            config_en_us.format
            (Configs.getConfig "anything").format
    , test "getConfig en_gb" <|
        \() ->
          Expect.equal
            config_en_gb.format
            (Configs.getConfig "en_gb").format
    , test "getConfig fr_fr" <|
        \() ->
          Expect.equal
            config_fr_fr.format
            (Configs.getConfig "fr_fr").format
    , test "getConfig ro_ro" <|
        \() ->
          Expect.equal
            config_pl_pl.format
            (Configs.getConfig "pl_pl").format
    , test "getConfig pl_pl" <|
        \() ->
          Expect.equal
            config_ro_ro.format
            (Configs.getConfig "ro_ro").format
    ]
