const { auth } = require('express-oauth2-jwt-bearer');

const jwtCheck = auth({
    audience: 'https://book-app/api',
    issuerBaseURL: 'https://dev-3bvkk0hsrquz68yn.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

module.exports = jwtCheck;