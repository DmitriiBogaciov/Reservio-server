const checkScope = (requiredScope) => (req, res, next) => {
    if (req.auth && Array.isArray(req.auth.payload.permissions) && req.auth.payload.permissions.includes(requiredScope)) {
        next();
    } else {
        const error = new Error('Insufficient Scope');
        error.status = 403;
        next(error);
    }
};

module.exports = checkScope;