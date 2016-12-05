// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
    'googleAuth' : {
      'clientID': '368305440792-d2qe1foo5qojlb3pf68q6f2g7t874094.apps.googleusercontent.com',
      'clientSecret': 'YHcq8eYFXMZAA0QfRRyJcKtR',
      // 'callbackURL': 'http://localhost:3000/auth/callback/google'
      'callbackURL': 'http://livewc.herokuapp.com/auth/callback/google'
    }
};
