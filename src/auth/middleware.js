'use strict';

const User = require('./users-model.js');

module.exports = (req, res, next) => {

  try {

    let [authType, encodedString] = req.headers.authorization.split(/\s+/);

    // BASIC Auth  ... Authorization:Basic ZnJlZDpzYW1wbGU=

    switch(authType.toLowerCase()) {
    case 'basic':
      return _authBasic(encodedString);
    case 'bearer':
      return _authBearer(encodedString);
    default:
      return _authError();
    }

  } catch(e) {
    return _authError();
  }

  async function _authBearer(token) {
    let user = await User.authenticateToken(token);
    await _authenticate(user);
  }

  function _authBasic(authString) {
    let base64Buffer = Buffer.from(authString,'base64'); // <Buffer 01 02...>
    let bufferString = base64Buffer.toString(); // john:mysecret
    let [username,password] = bufferString.split(':'); // variables username="john" and password="mysecret"
    let auth = {username,password}; // {username:"john", password:"mysecret"}
    console.log(auth);

    return User.authenticateBasic(auth)
      .then( user => _authenticate(user) );
  }

  function _authenticate(user) {
    if ( user ) {
      req.user = user;
      req.token = user.generateToken();
      next();
    }
    else {
      return _authError();
    }
  }

  function _authError() {
    next({status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'});
    return Promise.resolve();
  }

};

