const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

passport.use(new OIDCStrategy({
    identityMetadata: 'https://login.microsoftonline.com/{tenant-id}/v2.0/.well-known/openid-configuration',
    clientID: MICROSOFT_CLIENT_ID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: 'http://localhost:3000/auth/microsoft/callback',
    allowHttpForRedirectUrl: true,
    clientSecret: MICROSOFT_CLIENT_SECRET,
    validateIssuer: false,
    passReqToCallback: true,
  },
  (req, iss, sub, profile, accessToken, refreshToken, params, done) => {
    // Save the user profile to the database
    // Call done(null, user) to signal successful authentication
  }
));

app.get('/auth/microsoft',
  passport.authenticate('azuread-openidconnect'));

app.post('/auth/microsoft/callback',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  });
