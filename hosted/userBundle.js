"use strict";

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
    handleError("RAWR! All fields required");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });
  return false;
};

var UserList = function UserList(props) {
  if (props.users.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyDomo"
    }, "No Users yet"));
  }

  var userNodes = props.users.map(function (user) {
    return /*#__PURE__*/React.createElement("div", {
      key: user.userid,
      className: "domo"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "domoName"
    }, "Name: ", user.username, " "), /*#__PURE__*/React.createElement("h3", {
      className: "domoAge"
    }, "User ID: ", user.userid, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "domoList"
  }, userNodes);
};

var loadUsersFromServer = function loadUsersFromServer() {
  sendAjax('GET', '/getUsers', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(UserList, {
      users: data.users
    }), document.querySelector('#users'));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(UserList, {
    users: []
  }), document.querySelector('#users'));
  loadUsersFromServer();
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
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
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
