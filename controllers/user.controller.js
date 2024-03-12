const { User, Thought } = require('../models');

const userController = {
    // get all users
    getAllUsers (req, res) {
        User.find({})
        .populate({
            path: 'friends',
            select: '-__v',
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.json(err));
    },
    // get a user by id 
    getUserById ({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v',
        })
        .populate({
            path: 'friends',
            select: '-__v',
        })
        .select('-__v')
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user was found with this ID!' });
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },
    // create a new user
    createUser ({ body }, res) {
        User.create(body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.json(err));
    },
    // update an existing user
    updateUser ({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true,
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user was found with this ID!' });
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },
    // delete a user
    deleteUser ({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user was found with this ID!' })
            }
            return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
        })
        .then (() => {
            res.json({ message: 'User and their thoughts have been deleted.' });
        })
        .catch((err) => res.json(err));
    },
    // add a friend by id
    addFriend ({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user was found with this ID!' });
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },
    // remove a friend
    removeFriend ({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user was found with this ID!' });
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },
};

module.exports = userController;