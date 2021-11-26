const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');
// const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

// create a new ApolloServer to pass in data
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: authMiddleware,
});

// integrate ApolloServer apply it to the Express server as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// app.use(routes);

db.once('open', () => {
	app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
