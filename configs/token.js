const FormatDate = require('../functions/FormatDate')

const configsToken = {
  secret: "bezkoder-secret-key",
  jwtExpiration: FormatDate.oneHour,
  jwtRefreshExpiration: FormatDate.oneDay,
}

module.exports = configsToken