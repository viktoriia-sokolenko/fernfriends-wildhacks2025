const fs = require('fs');
const { auth } = require('express-openid-connect');
const dotenv = require('dotenv');
const port = process.env.PORT || 3000;
dotenv.config();
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUERBASEURL,
  };


const express = require('express');
const app = express();

app.use(auth(config));

app.get('/', (req, res) => {
  //res.send('Hello World!');
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});



// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

const { requiresAuth } = require('express-openid-connect');

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

