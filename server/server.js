const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
// import the resolvers and typeDefs
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

// This creates a news ApolloServer to pass in data.
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: authMiddleware,
});

// This integrates the ApolloServer and applies the data to the Express server as middleware.
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
// If it's in production, then client/build are static assets.
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// This opens the port and has a message that the localhost is listening.
db.once('open', () => {
	app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
