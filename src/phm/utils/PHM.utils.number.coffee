###
PHM.utils.number module
###
(->
  exports = this
  self = exports.PHM.utils.number = {}

  self.shorten = (number) ->
    result = Number(number)
    return "" if isNaN(result)
    abbreviations =
      'K': 1000
      'M': 1000000
      'B': 1000000000
    _(abbreviations).each (value, key) ->
      base = Number(number) / value
      if base >= 1
        if Math.abs(base % 1) > 0.1
          shortNumber = base.toFixed(1)
        else
          shortNumber = base.toFixed(0)
        result = "#{shortNumber}#{key}"
    return result
)()
