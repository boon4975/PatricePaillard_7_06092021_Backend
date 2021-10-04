const auth = require('../middleware/auth');

module.exports = function(routeUser) {
    const user = require('../controllers/user');
    routeUser.post('/api/auth/signup', user.signup);
    routeUser.post('/api/auth/login', user.login);
    routeUser.put('/api/auth/profil', auth, user.profil);
    routeUser.delete('/api/auth/profil/:id', auth, user.deluser);
    routeUser.put('/api/auth/profil/moderator', auth, user.updateModerator)
}
