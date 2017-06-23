module UpsertInstallation exposing (upsertInstallation)

import Http
import Json.Encode as Encode
import Api exposing (..)
import Message exposing (..)
import Types exposing (..)


upsertInstallation : Stop -> DeviceToken -> Cmd Msg
upsertInstallation stop deviceToken =
    Http.send ReceiveInstallationResponse <| putInstallation deviceToken stop


upsertInstallationEndpoint : DeviceToken -> String
upsertInstallationEndpoint deviceToken =
    baseUrl ++ "/api/v2/installations/" ++ (deviceTokenToString deviceToken)


putInstallation : DeviceToken -> Stop -> Http.Request ()
putInstallation deviceToken stop =
    put
        (upsertInstallationEndpoint deviceToken)
        (installationBody stop)


installationBody : Stop -> Http.Body
installationBody stop =
    Http.jsonBody <|
        Encode.object
            [ ( "operating_system", Encode.string "ios" )
            , ( "home_stop_id", Encode.string <| stopToString stop )
            , ( "push_notifications_enabled", Encode.bool True )
            ]


put : String -> Http.Body -> Http.Request ()
put url body =
    Http.request
        { method = "PUT"
        , headers = []
        , url = url
        , body = body
        , expect = Http.expectStringResponse (\_ -> Ok ())
        , timeout = Nothing
        , withCredentials = False
        }
