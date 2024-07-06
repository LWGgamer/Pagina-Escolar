// middlewares/auth.js

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login.html');
}

function isAuthorized(req, res, next) {
    if (req.user && (req.user.role === 'professor' || req.user.role === 'coordenador')) {
        return next();
    }
    res.status(403).send('Acesso negado.');
}

module.exports = {
    isAuthenticated,
    isAuthorized
};
