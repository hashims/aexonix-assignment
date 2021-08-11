const router = require('express').Router();
const controller = require('../controllers/users');
const { verifyToken: auth } = require('../middlewares/auth');


router.post('/', controller.createUser);

router.get('/', auth, controller.allUsers);

router.patch('/:userid', auth, controller.updateUser);

router.post('/login',  controller.login);

router.get('/search-user', auth, controller.searchUsers);


module.exports = router;
