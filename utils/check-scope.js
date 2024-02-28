const checkScope = (requiredScope) => (req, res, next) => {
    if (req.auth && req.auth.payload.permissions.includes(requiredScope)) {
        next();
    } else {
        const error = new Error('Insufficient Scope');
        error.status = 403
        next(error);
        // res.status(403).json({ error: "Insuffinient Scope"});
    }
}

module.exports = checkScope;