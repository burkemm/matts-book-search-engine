const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');
// This is the resolvers.
const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findOne({ _id: context.user._id }).select(
					'-__v -password'
				);
				return userData;
			}
			throw new AuthenticationError('You need to be logged in!');
		},
	},
	// Adding a mutation to add the user and a token for the session.
	Mutation: {
		addUser: async (parent, args) => {
			const user = await User.create(args);
			const token = signToken(user);
			return { token, user };
		},
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError('No user found');
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw new AuthenticationError('Incorrect credentials');
			}

			const token = signToken(user);

			return { token, user };
		},
		// This function saves the book they look for to the user session.
		saveBook: async (parent, { newBook }, context) => {
			if (context.user) {
				const updatedUser = await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $push: { savedBooks: newBook } },
					{ new: true }
				);
				return updatedUser;
			}
			throw new AuthenticationError('You need to be logged in!');
		},
		// This removes the book from the user's session.
		removeBook: async (parent, { bookId }, context) => {
			if (context.user) {
				const updatedUser = await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $pull: { savedBooks: { bookId } } },
					{ new: true }
				);
				return updatedUser;
			}
			throw new AuthenticationError('You need to be logged in!');
		},
	},
};

module.exports = resolvers;
