"use strict";

var handleRecipe = function handleRecipe(e) {
  e.preventDefault();
  $("#recipeMessage").animate({
    height: 'hide'
  }, 350);

  if ($("#nameField").val() == '' || $("#servesField").val() == '' || $("#ingredientField").val() == '' || $("#instructionField").val() == '') {
    handleError("Please fill in all fields.");
    console.log("err: not all data present");
    return false;
  }

  sendAjax('POST', $("#recipeForm").attr("action"), $("#recipeForm").serialize(), function () {
    loadRecipesFromServer();
  });
  return false;
};

var RecipeForm = function RecipeForm(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Have a Recipe? Submit it!"), /*#__PURE__*/React.createElement("form", {
    id: "recipeForm",
    onSubmit: handleRecipe,
    name: "recipeForm",
    action: "/maker",
    method: "POST",
    className: "recipeForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name",
    className: "formTxt"
  }, "Recipe Name: "), /*#__PURE__*/React.createElement("input", {
    id: "nameField",
    type: "text",
    name: "name",
    className: "formItem",
    placeholder: "Recipe Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "serves",
    className: "formTxt"
  }, "Serves: "), /*#__PURE__*/React.createElement("input", {
    id: "servesField",
    type: "number",
    name: "serves",
    min: "0",
    max: "100",
    step: "1",
    className: "formItem"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "ingredients",
    className: "formTxt"
  }, "Ingredients: "), /*#__PURE__*/React.createElement("textarea", {
    id: "ingredientField",
    name: "ingredients",
    rows: "15",
    col: "50",
    className: "formItem"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "instructions",
    className: "formTxt"
  }, "Instructions: "), /*#__PURE__*/React.createElement("textarea", {
    id: "instructionField",
    name: "instruction",
    rows: "15",
    col: "50",
    className: "formItem"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Make Recipe",
    className: "formItem"
  })));
};

var RecipeList = function RecipeList(props) {
  if (props.recipes.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "recipeList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyRecipe"
    }, "No Recipes yet"));
  }

  var recipeNodes = props.recipes.map(function (recipe) {
    return /*#__PURE__*/React.createElement("div", {
      key: recipe._id,
      className: "recipe"
    }, /*#__PURE__*/React.createElement("h3", null, "Name: ", recipe.name, " "), /*#__PURE__*/React.createElement("h3", null, "Serves: ", recipe.serves, " "), /*#__PURE__*/React.createElement("h3", null, "Ingredients: ", recipe.ingredients, " "), /*#__PURE__*/React.createElement("h3", null, "Instructions: ", recipe.instructions, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "recipeList"
  }, recipeNodes);
};

var loadRecipesFromServer = function loadRecipesFromServer() {
  sendAjax('GET', '/getRecipes', null, function (data) {
    //console.log(data.recipes);
    ReactDOM.render( /*#__PURE__*/React.createElement(RecipeList, {
      recipes: data.recipes
    }), document.querySelector('#recipes'));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(RecipeForm, {
    csrf: csrf
  }), document.querySelector('#makeRecipe'));
  loadRecipesFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#recipeMessage").animate({
    height: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#recipeMessage").animate({
    height: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.parse);
    }
  });
};
