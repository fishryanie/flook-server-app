const oneMinutes = 60 // 1 minutes
const oneHour = 3600 // 1 hour 
const oneDay = 8640000 // 1 day

const configsToken = {
  secret: "bezkoder-secret-key",
  jwtExpiration: oneHour * 12,
  jwtRefreshExpiration: oneDay * 7,
  jwtChangePass: oneMinutes * 5
}

module.exports = configsToken