
## Format Strings

The module `Date.Extra.Format` exports

* `format : Config -> String -> Date -> String`.
* `formatUtc : Config -> String -> Date -> String`.
* `formatOffset : Config -> Int -> String -> Date -> String`.

The `Config` refers to the configuration of i18n and default strings for some basic localisation support.

The `Date` refers to Elm's standard [Date library](http://package.elm-lang.org/packages/elm-lang/core/latest/Date).

The input `String` may contain any of the following substrings, which will be expanded to parts of the date resultant string format of date

* `%Y` - 4 digit year, zero-padded
* `%m` - Zero-padded month of year, e.g. `"07"` for July
* `%_m` - Space-padded month of year, e.g. `" 7"` for July
* `%-m` - Month of year, e.g. `"7"` for July
* `%B` - Full month name, e.g. `"July"`
* `%^B` - Uppercase full month name, e.g. `"JULY"`
* `%b` - Abbreviated month name, e.g. `"Jul"`
* `%^b` - Uppercase abbreviated month name, e.g. `"JUL"`
* `%d` - Zero-padded day of month, e.g `"02"`
* `%-d` - Day of month, e.g `"2"`
* `%-@d` - Day of Month with language idiom suffix Day of month, e.g `"2nd"`
 * this currently only does this in english language
* `%e` - Space-padded day of month, e.g `" 2"`
* `%@e` - Space-padded Day of Month with language idiom suffix, e.g `" 2nd"`
 * this currently only does this in english language
* `%A` - Day of week in full, e.g. `"Wednesday"`
* `%^A` - Uppercase Day of week in full, e.g. `"WEDNESDAY"`
* `%a` - Day of week, abbreviated to three letters, e.g. `"Wed"`
* `%^a` - Uppercase day of week, abbreviated to three letters, e.g. `"WED"`
* `%H` - Hour of the day, 24-hour clock, zero-padded
* `%-H` - Hour of the day, 24-hour clock, no padding
* `%k` - Hour of the day, 24-hour clock, space-padded
* `%I` - Hour of the day, 12-hour clock, zero-padded
* `%-I` - Hour of the day, 12-hour clock, no padding
* `%l` - (lower ell) Hour of the day, 12-hour clock, space-padded
* `%p` - AM or PM
* `%P` - am or pm
* `%M` - Minute of the hour, zero-padded
* `%S` - Second of the minute, zero-padded
* `%L` - Milliseconds of a second, length 3 zero-padded
* `%z` - time zone offset format "(+/-)HHMM"
* `%:z` - time zone offset format "(+/-)HH:MM"
* `%%` - produces a `%`


These tokens are a subset of those from [Ruby](http://apidock.com/ruby/DateTime/strftime).
