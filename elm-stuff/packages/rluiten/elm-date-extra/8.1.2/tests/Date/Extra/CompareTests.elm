module Date.Extra.CompareTests exposing (..)

{- Test date comparison.

Copyright (c) 2016 Robin Luiten
-}

import Date exposing (Date)
import Test exposing (..)
import Expect
import Time exposing (Time)

import Date.Extra.Compare as Compare exposing (Compare2 (..), Compare3 (..))
import Date.Extra.Core as Core


tests : Test
tests =
  describe "Date.Compare tests"
    [ describe "is tests" <|
        List.map runIsCase isCases
    , describe "is3 tests" <|
        List.map runIs3Case is3TestCases
    ]


{-
Have no way to easilly change into out of daylight saving
as cant set/check zones. So this is limited, and there will
be complications somewhere I am sure.

Time : 1407833631116
  is : 2014-08-12T08:53:51.116+00:00

Time : 1407833631115
  is : 2014-08-12T08:53:51.115+00:00

Time : 1407833631114
  is : 2014-08-12T08:53:51.114+00:00

-}
aTestTime6 = floor 1407833631116.0
aTestTime5 = floor 1407833631115.0
aTestTime4 = floor 1407833631114.0


runIsCase (name, comp, date1, date2, expected) =
  test name <|
    \() ->
      Expect.equal
        expected
        (Compare.is comp date1 date2)


isCases =
  [ ( "is After date1 > date2"
    , After
    , Core.fromTime aTestTime6
    , Core.fromTime aTestTime5
    , True
    )
  , ( "is After same dates"
    , After
    , Core.fromTime aTestTime6
    , Core.fromTime aTestTime6
    , False
    )
  , ( "is SameOrAfter same dates"
    , SameOrAfter
    , Core.fromTime aTestTime6
    , Core.fromTime aTestTime6
    , True
    )
  , ( "is Before date1 > date2"
    , Before
    , Core.fromTime aTestTime6
    , Core.fromTime aTestTime5
    , False
    )
  , ( "is Before date1 < date2"
    , Before
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime6
    , True
    )
  , ( "is Before same dates"
    , Before
    , Core.fromTime aTestTime6
    , Core.fromTime aTestTime6
    , False
    )
  , ( "is SameOrBefore same dates"
    , SameOrBefore
    , Core.fromTime aTestTime6
    , Core.fromTime aTestTime6
    , True
    )
  ]



runIs3Case (name, comp, date1, date2, date3, expected) =
  test name <|
    \() ->
      Expect.equal
        expected
        (Compare.is3 comp date1 date2 date3)


is3TestCases =
  [ ( "is3 Between where date1 is between date2 and date3, date2 > date3"
    , Between
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime6
    , Core.fromTime aTestTime4
    , True
    )
  , ( "is3 Between where date1 is between date2 and date3, date2 < date3"
    , Between
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime4
    , Core.fromTime aTestTime6
    , True
    )
  , ( "is3 Between where date1 is before date2 or date3"
    , Between
    , Core.fromTime aTestTime4
    , Core.fromTime aTestTime6
    , Core.fromTime aTestTime5
    , False
    )
  , ( "is3 Between where date1 is after date2 or date3"
    , Between
    , Core.fromTime aTestTime6
    , Core.fromTime aTestTime4
    , Core.fromTime aTestTime5
    , False
    )
  , ( "is3 Between where date1 is same or after the lower of date2 or date3"
    , Between
    , Core.fromTime aTestTime4
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime4
    , False
    )
  , ( "is3 BetweenOpenStart where date1 is same as the the lower of date2 or date3"
    , BetweenOpenStart
    , Core.fromTime aTestTime4
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime4
    , True
    )
  , ( "is3 Between where date1 is same as the higher of date2 or date3"
    , Between
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime4
    , False
    )
  , ( "is3 BetweenOpenEnd where date1 is same as the higher of date2 or date3"
    , BetweenOpenEnd
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime4
    , True
    )
  , ( "is3 Between where date1 is same as both date2 and date3"
    , Between
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime5
    , False
    )
  , ( "is3 BetweenOpenStart where date1 is same as both date2 and date3"
    , BetweenOpenStart
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime5
    , False
    )
  , ( "is3 BetweenOpenEnd where date1 is same as both date2 and date3"
    , BetweenOpenEnd
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime5
    , False
    )
  , ( "is3 BetweenOpen where date1 is same as both date2 and date3"
    , BetweenOpen
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime5
    , True
    )
  , ( "is3 BetweenOpen where date1 is after both date2 and date3"
    , BetweenOpen
    , Core.fromTime aTestTime6
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime5
    , False
    )
  , ( "is3 BetweenOpen where date1 is before both date2 and date3"
    , BetweenOpen
    , Core.fromTime aTestTime4
    , Core.fromTime aTestTime5
    , Core.fromTime aTestTime5
    , False
    )
  ]
