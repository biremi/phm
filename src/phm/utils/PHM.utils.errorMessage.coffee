###
PHM.utils.errorMessage module
###
(->
  exports = this
  self = exports.PHM.utils.errorMessage = {}
  self.get = (displayName, error) ->
    message = self.commonMessages[error]
    if !message?
      console.warn('unexpected error message: ' + error)
      message = error
    text = message.replace('\{\{displayName\}\}', displayName)
    PHM.utils.capitalize(text)

  self.commonMessages =
    "empty":                    "enter your {{displayName}} please"
    "blank_value":              "enter your {{displayName}} please"
    "nil_value":                "enter your {{displayName}} please"
    "too_big":                  "{{displayName}} is too big"
    "too_small":                "{{displayName}} is too small"
    "not_an_integer":           "{{displayName}} should be valid number"
    "should_be_positive":       "{{displayName}} should be positive number"
    "too_short":                "{{displayName}} is too short"
    "already_taken":            "such {{displayName}} is already taken"
    "too_long":                 "{{displayName}} is too long"
    "incorrect_domain":         "non-existent email domain"
    "incorrect_format":         "{{displayName}} has invalid format"
    "invalid_string_format":    "{{displayName}} has illegal characters"
    "invalid_format":           "{{displayName}} has invalid format"
    "invalid_url":              "URL is invalid"
    "invalid":                  "invalid {{displayName}}"
    "float_received_instead_of_integer": "{{displayName}} should be integer number"
    "younger_than_13":          "you should be at least 13 years old"
    "user_is_banned":           "You have been banned"
)()
