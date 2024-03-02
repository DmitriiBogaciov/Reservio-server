const { auth } = require('express-oauth2-jwt-bearer');

const jwtCheck = auth({
    audience: process.env.audience,
    issuerBaseURL: process.env.issuerBaseURL,
    tokenSigningAlg: 'RS256'
});

module.exports = jwtCheck;