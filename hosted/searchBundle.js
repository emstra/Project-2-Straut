"use strict";

var handleSearch = function handleSearch(e) {
  e.preventDefault(); //$("#recipeMessage").animate({ height: 'hide' }, 350);
  //console.log('here');

  if ($("#searchField").val() == '') {
    // get all recipes if search bar is empty
    loadRecipesFromServer();
    return false;
  } // get all the recipes when the page loads


  sendAjax('GET', '/bySearch', $("#searchForm").serialize(), function (data) {
    //console.log(data.recipes);
    ReactDOM.render( /*#__PURE__*/React.createElement(RecipeList, {
      recipes: data.recipes
    }), document.querySelector('#recipeContentvert'));
  });
  document.querySelector("#searchForm").reset();
  return false;
};

var SearchForm = function SearchForm(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "searchBar"
  }, /*#__PURE__*/React.createElement("form", {
    id: "searchForm",
    onSubmit: handleSearch,
    name: "searchForm",
    action: "/allRecipes",
    method: "GET",
    className: "searchForm"
  }, /*#__PURE__*/React.createElement("input", {
    id: "searchField",
    type: "text",
    name: "search",
    className: "formItem"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Search",
    className: "formButton"
  })));
};

var RecipeList = function RecipeList(props) {
  if (props.recipes.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "recipeContenthor"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyRecipe"
    }, "No Recipes"));
  }

  var recipeHolder = []; //holds 3 recipes to let them all be added at once

  var recipeNodes = []; // Holds all recipes

  var numElAdded = 0; //recipeNodes.push(<section class="recipeContenthor" ></section>);

  props.recipes.forEach(function (recipe) {
    recipeHolder.push( /*#__PURE__*/React.createElement("div", {
      key: recipe._id,
      className: "recipe"
    }, /*#__PURE__*/React.createElement("button", {
      className: "RecipeBox"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, recipe.name), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Serves:"), recipe.serves), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Ingredients")), /*#__PURE__*/React.createElement("p", null, recipe.ingredients), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Instructions")), /*#__PURE__*/React.createElement("p", null, recipe.instructions)))));
    numElAdded++;

    if (numElAdded % 3 === 0 || props.recipes.length === numElAdded) {
      recipeNodes.push( /*#__PURE__*/React.createElement("section", {
        key: recipe._id,
        className: "recipeContenthor"
      }, " ", recipeHolder, " ")); // push up to 3 recipes into one row

      recipeHolder = []; //clear recipeholder
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "recipeList"
  }, recipeNodes);
};

var loadRecipesFromServer = function loadRecipesFromServer() {
  // get all the recipes when the page loads
  sendAjax('GET', '/allRecipes', null, function (data) {
    //console.log(data.recipes);
    ReactDOM.render( /*#__PURE__*/React.createElement(RecipeList, {
      recipes: data.recipes
    }), document.querySelector('#recipeContentvert'));
  });
};

var setup = function setup(csrf) {
  // gets called when the page is set up
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, {
    csrf: csrf
  }), document.querySelector('#search'));
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
