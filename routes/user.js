const auth = require('../middleware/auth');

module.exports = function(routeUser) {
    const user = require('../controllers/user');
    routeUser.post('/api/auth/signup', user.signup);
    routeUser.post('/api/auth/login', user.login);
//route gestion Profil
    routeUser.put('/api/auth/profil', auth, user.changePwd);
    routeUser.delete('/api/auth/profil/:id', auth, user.delUser);
    routeUser.put('/api/auth/profil/moderator', auth, user.updateModerator)
}
