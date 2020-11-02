// Include models
const models = require('../models');

// Get Domo model
const { Domo } = models;

// Load page
const makerPage = (req, res) => {
  // Find the domo for the active user
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    // Send the data to the page
    // Attach to csurf
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

// Make a domo
const makeDomo = (req, res) => {
  // Check for valid data
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  console.log('about to see req.session');
  console.dir(req.session);
  console.log('done seeing req.session');

  // Create domo js object
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  // Make a new domo model from the js object created above
  const newDomo = new Domo.DomoModel(domoData);

  // Save new domo
  const domoPromise = newDomo.save();

  // Finish
  domoPromise.then(() => res.json({ redirect: '/maker' }));

  // Catch errors
  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  // Complete and return the saved object
  return domoPromise;
};

// Exports
module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
