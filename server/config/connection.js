const mongoose = require('mongoose');

console.log(process.env.MONGODB_URI);
// This connects to the mongodb.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

module.exports = mongoose.connection;
