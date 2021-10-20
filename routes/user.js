const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

module.exports = function(routeUser) {
    const user = require('../controllers/user');
    routeUser.post('/api/auth/signup', user.signup);
    routeUser.post('/api/auth/login', user.login);
//route gestion Profil
    routeUser.put('/api/auth/setpwd', auth, user.changePwd);
    routeUser.put('/api/auth/avatar', auth, multer, user.avatar);
    routeUser.delete('/api/auth/profil/:id', auth, user.delAccount);
    routeUser.put('/api/auth/profil/moderator', auth, user.updateModerator);
}
