module.exports = function(routeUser) {
    const user = require('../controllers/user');
    routeUser.post('/api/auth/signup', user.signup);
    routeUser.post('/api/auth/login', user.login);
    routeUser.put('/api/auth/profil', user.profil)
}
