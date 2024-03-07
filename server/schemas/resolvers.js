const { User, Book } = require('../models');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // Placeholder: Implement logic to retrieve the authenticated user's data
      // from the context object
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      const user = await User.findById(context.user._id).populate('savedBooks');
      return user;
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      // Placeholder: Implement logic to validate the user's credentials
      // and generate a JWT token
      const user = await User.findOne({ email });
      if (!user || !user.isCorrectPassword(password)) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args) => {
      // Placeholder: Implement logic to create a new user
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      // Placeholder: Implement logic to save a book to the user's account
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to save books');
      }
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $push: { savedBooks: bookData } },
        { new: true }
      );
      return updatedUser;
    },
    removeBook: async (parent, { bookId }, context) => {
      // Placeholder: Implement logic to remove a book from the user's account
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to remove books');
      }
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      return updatedUser;
    },
  },
};

module.exports = resolvers;