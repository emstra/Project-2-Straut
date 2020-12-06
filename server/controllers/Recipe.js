const models = require('../models');
const { RecipeModel } = require('../models/Recipe');

const { Recipe } = models;

const makerPage = (req, res) => {
  // returns the maker page, plus all the recipe docs

  Recipe.RecipeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), recipes: docs });
  });
};

const searchPage = (req, res) => {
  // render the search page
  Recipe.RecipeModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('search', { recipes: docs });
  });
};

const makeRecipe = (req, res) => {
  // Makes a recipe
  console.dir('here');
  if (!req.body.name || !req.body.serves || !req.body.ingredients || !req.body.instruction) {
    return res.status(400).json({ error: 'all fields required' });
  }

  const recipeData = {
    name: req.body.name,
    serves: req.body.serves,
    ingredients: req.body.ingredients,
    instructions: req.body.instruction,
    owner: req.session.account._id,
  };

  const newRecipe = new Recipe.RecipeModel(recipeData);

  const recipePromise = newRecipe.save();

  recipePromise.then(() => res.json({ redirect: '/maker' }));

  recipePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Recipe already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return recipePromise;
};

const getRecipes = (request, response) => {
  // gets recipes by owner
  const req = request;
  const res = response;

  return Recipe.RecipeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ recipes: docs });
  });
};

const getAll = (request, response) => {
  // gets all recipes regardless of owner
  const res = response;

  return Recipe.RecipeModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ recipes: docs });
  });
};

const getBySearch = (req, res) => RecipeModel.findByName(req.query.search, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }

  return res.json({ recipes: docs });
});

module.exports.makerPage = makerPage;
module.exports.searchPage = searchPage;
module.exports.getRecipes = getRecipes;
module.exports.getBySearch = getBySearch;
module.exports.make = makeRecipe;
module.exports.getAll = getAll;
