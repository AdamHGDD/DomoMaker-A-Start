// Includes
const models = require('../models');
const Account = models.Account;

// Basic events
const loginPage = (req, res) => {
	res.render('login');
};

const signupPage = (req, res) => {
	res.render('signup');
};

const logout = (req, res) => {
	res.redirect('/');
};

// Main methods
const login = (request, response) => {
	// Local versions
	const req = request;
	const res = response;

	// Force cast to strings to cover security flaws
	const username = `${req.body.username}`;
	const password = `${req.body.pass}`;

	// Missing fields
	if (!username || !password){
		return res.status(400).json({error: 'RAWR! All fields are required'});
	}

	// Attempt login
	return Account.AccountModel.authenticate(username, password, (err, account) => {
		if (err || !account) {
			return res.status(401).json({error: 'Wrong username or password'});
		}

		// Successfully logged in
		return res.json({redirect: '/maker'});
	});
};

const signup = (request, response) => {
	// Local versions
	const req = request;
	const res = response;

	// Cast to strings to cover up some security flaws
	req.body.username = `${req.body.username}`;
	req.body.pass = `${req.body.pass}`;
	req.body.pass2 = `${req.body.pass2}`;

	// Data error checks
	if (!req.body.username || !req.body.pass || !req.body.pass2) {
		return res.status(400).json({error: 'RAWR! All fields are required'});
	}
	if (req.body.pass !== req.body.pass2) {
		return res.status(400).json({error: 'RAWR! Passwords do not match'});
	}

	// Encrypt and attach
	return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
		const accountData = {
			username: req.body.username,
			salt,
			password: hash,
		};

		// Turn data into account
		const newAccount = new Account.AccountModel(accountData);

		// Save data
		const savePromise = newAccount.save();

		// Redirect user
		savePromise.then(() => res.json({redirect: '/maker'}));

		// Catch error
		savePromise.catch((err) => {
			console.log(err);

			// Existing user
			if (err.code === 11000){
				return res.status(400).json({error: 'Username already in use'});
			}
			// Other errors
			return res.status(400).json({error: 'An error occurred'});
		});
	});
};

// Exports
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;