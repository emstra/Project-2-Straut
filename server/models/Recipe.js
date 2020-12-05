const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let RecipeModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId; // this is a function not a variable
// I should have been smart enough to realize that, but here we are.
const setName = (name) => _.escape(name).trim();

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  serves: {
    type: Number,
    min: 0,
    required: true,
  },

  ingredients: {
    type: String,
    required: true,
    trim: true,
  },

  instructions: {
    type: String,
    required: true,
    trim: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

RecipeSchema.statics.toApI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

RecipeSchema.statics.findByOwner = (ownerID, callback) => {
  //find recipes by who owns them
  const search = {
    owner: convertID(ownerID),
  };

  return RecipeModel.find(search).select('name serves ingredients instructions').lean().exec(callback);
};

RecipeSchema.statics.findByName = (recName, callback) => {
  // find all recipes containing the search term
  const search = {
    name : {$regex:`.*${recName}.*`},
    // this regex should make it so that Mongodb matches strings containing the search
  };

  return RecipeModel.find(search).select('name serves ingredients instructions').lean().exec(callback);
};

RecipeSchema.statics.findAll = (callback) => {
  // return all recipes, regardless of any search terms
  RecipeModel.find().select('name serves ingredients instructions').lean().exec(callback);
};

RecipeModel = mongoose.model('Recipe', RecipeSchema);

module.exports.RecipeModel = RecipeModel;
module.exports.RecipeSchema = RecipeSchema;
