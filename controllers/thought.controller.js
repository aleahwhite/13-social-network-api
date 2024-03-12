const { Thought, User } = require('../models');

const thoughtController = {
    // get all existing thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: 'reactions',
            select: '-__v',
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => res.json(err));
    },
    // get thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
            path: 'reactions',
            select: '-__v',
        })
        .select('-__v')
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought with this ID!' });
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.json(err));
    },
    // create a new thought
    createThought({ params, body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id } },
                { new: true },
            );
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found with this ID!' });
            }
            res.json({ message: 'Thought successfully created!' });
        })
        .catch((err) => res.json(err));
    },
    // update an already existing thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true,
        })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
               return res.status(404).json({ message: 'No thought found with this ID!' });
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.json(err));
    },
    // delete a thought by id
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then ((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought was found with this ID!' });
            }
            // delete the thought from users page
            return User.findOneAndUpdate(
                { thoughts: params.id },
                { $pull: { thoughts: params.id } },
                { new: true },
            );
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user with this ID!' });
            }
            res.json({ message: 'Thought was successfully deleted!' });
        })
        .catch((err) => res.json(err));
    },
    // add a reaction to a thought
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true },
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found with this ID!' });
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.json(err));
    },
    // remove a reaction to a though
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId} } },
            { new: true },
        )
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => res.json(err));
    },
};

module.exports = thoughtController;