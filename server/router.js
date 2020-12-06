// const { model } = require('mongoose');

const controllers = require('./controllers');
const mid = require('./middleware');
// const { Account } = require('./models');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getRecipes', mid.requiresLogin, controllers.Recipe.getRecipes);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/search', mid.requiresSecure, controllers.Recipe.searchPage);

  // app.get('/users', mid.requiresLogin, controllers.Account.usersPage);
  // app.get('/getUsers', mid.requiresLogin, controllers.Account.showUsers);

  app.get('/allRecipes', controllers.Recipe.getAll);
  app.get('/bySearch', controllers.Recipe.getBySearch);
  app.get('/maker', mid.requiresLogin, controllers.Recipe.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Recipe.make);
  app.get('/', mid.requiresSecure, controllers.Recipe.searchPage);
};

module.exports = router;
