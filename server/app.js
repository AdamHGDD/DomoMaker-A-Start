// Import libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');

// Get port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Get database
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';

// Create mongoose options
const mongooseOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}

// Set up mongoose with its options
mongoose.connect(dbURL, mongooseOptions, (err) => {
	if(err) {
		console.log('Could not connect to database');
		throw err;
	}
});

// Pull in our routes
const router = require('./router.js');

// Set app up
const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
	extended:true,
}));
app.engine('handlebars', expressHandlebars({defaultLayout : 'main'}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

// Attach to router
router(app);

app.listen(port, (err) => {
	if(err) {
		throw err;
	}
	console.log(`Listening on port ${port}`);
});