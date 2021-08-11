const User = require('../models/user');
const bcrypt = require('bcrypt');
const { createUserSchema, updateUserSchema } = require('../middlewares/validators');
const { createToken } = require('../middlewares/auth');
const { Op } = require("sequelize");


const createUser = async (req, res, next) => {
    const obj = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile,
        address: req.body.address
    }

    const saltRounds = 10;
    const { error } = createUserSchema.validate(obj);

    if (error) {
        return res.status(400).send(error.message);
    }

    try {
        obj.password = await bcrypt.hash(obj.password, saltRounds);
        let [user, created] = await User.findOrCreate({
            where: {
                [Op.or]: [{ email: obj.email }, { mobile: obj.mobile }]
            },
            defaults: obj,
            raw: true
        });


        if (!created) {
            return res.status(409).send('User already exist');
        }

        user.token = createToken(user);
        res.status(201).json(user)
    } catch (error) {
        next(error);
    }
}


const login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        where: {
            email
        },
        raw: true
    });

    try {
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(400).send('Invalid Password');
        }

        const token = createToken(user);
        res.status(200).json(token);
    } catch (erroror) {
        next(error);
    }

}


const allUsers = async (req, res, next) => {
    const perPage = Number(req.query.perPage) || 50;
    const currentPage = (Number(req.query.currentPage) - 1) || 0;
    const skip = perPage * currentPage;

    try {
        const users = await User.findAll({
            offset: skip,
            limit: perPage,
        });

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}


const searchUsers = async (req, res) => {
    const perPage = Number(req.query.perPage) || 50;
    const currentPage = (Number(req.query.currentPage) - 1) || 0;
    const skip = perPage * currentPage;
    const searchQuery = req.query.searchquery;

    try {
        const users = await User.findAll({
            offset: skip,
            limit: perPage,
            where: {
                [Op.or]: {
                    firstName: {
                        [Op.like]: `%${searchQuery}%`
                    },
                    lastName: {
                        [Op.like]: `%${searchQuery}%`
                    },
                    email: {
                        [Op.like]: `%${searchQuery}%`
                    },
                    mobile: {
                        [Op.like]: `%${searchQuery}%`
                    }
                }
            }
        });

        if (users.length === 0) {
            return res.status(404).send('No record found');
        }

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

const updateUser = async (req, res) => {
    const userId = req.params.userid;
    const obj = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
        address: req.body.address
    }

    const { error } = updateUserSchema.validate(obj);

    if (error) {
        return res.status(400).send(error.message);
    }

    try {
        let user = await User.findByPk(userId);

        if (!user) {
            return res.status(400).send('Invalid user id');
        }

        user = await user.update(obj);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}


module.exports = {
    createUser,
    login,
    allUsers,
    searchUsers,
    updateUser
};
