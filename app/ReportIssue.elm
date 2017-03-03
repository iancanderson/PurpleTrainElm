module ReportIssue exposing (report)

import Http
import Message exposing (..)
import Types exposing (..)
import Api exposing (..)
import Json.Decode as Decode
import Json.Encode as Encode


report : Direction -> Stop -> Cmd Msg
report direction =
    Http.send ReceiveIssueResponse << postReport direction


reportUrlEndpoint : String
reportUrlEndpoint =
    baseUrl ++ "/api/v2/issues"


postReport : Direction -> Stop -> Http.Request ()
postReport direction stop =
    Http.post
        reportUrlEndpoint
        (issueBody direction stop)
        voidDecoder


issueBody : Direction -> Stop -> Http.Body
issueBody direction stop =
    Http.jsonBody <|
        Encode.object
            [ ( "direction", Encode.string <| toString direction )
            , ( "stop_id", Encode.string stop )
            ]


voidDecoder : Decode.Decoder ()
voidDecoder =
    Decode.succeed ()
