module.exports = function(routeUser) {
    const user = require('../controllers/user');
    routeUser.post('/api/auth/signup', user.signup)
}