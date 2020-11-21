const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to string to cover security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'all fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      console.log(password);
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'all fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'username already in use' });
      }

      return res.status(400).json({ error: 'an error occurred' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  console.log(`CSRF JSON${csrfJSON.csrfToken}`);
  res.json(csrfJSON);
};

const showUsers = (request, response) => {
  // const req = request;
  const res = response;

  return Account.AccountModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400);
    }

    const docsToReturn = [];
    // for (const user of docs) {
    //   docsToReturn.push({ username: user.username, userid: user._id });
    // }

    docs.forEach((user) => {
      docsToReturn.push({ username: user.username, userid: user._id });
    });

    console.dir(docsToReturn);

    return res.json({ users: docsToReturn });
  });
};

const usersPage = (req, res) => {
  res.render('users', { csrfToken: req.csrfToken() });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.usersPage = usersPage;
module.exports.showUsers = showUsers;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
