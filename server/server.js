const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const mongoose = require('mongoose');
const path = require('path');
const authMiddleware = require('./utils/auth');

const app = express();

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    return { user: authMiddleware.getUser(token) };
  },
});

// Apply Apollo middleware
server.applyMiddleware({ app });

// Middleware
app.use(express.json());
app.use(authMiddleware);

// Serve static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Start the server
app.listen({ port: process.env.PORT || 4000 }, () =>
  console.log(`Server running at http://localhost:4000${server.graphqlPath}`)
);