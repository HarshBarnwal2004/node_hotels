const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();
const passport = require('./auth'); // Import the passport configuration


const bodyParser = require('body-parser');
app.use(bodyParser.json());  //req.body
const PORT = process.env.PORT || 3000;


//Middleware to log requests
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] Request Made to: ${req.originalUrl}`);
  next();
}
app.use(logRequest);


app.use(passport.initialize());

const localMiddleware = passport.authenticate('local',{session: false})
app.get('/',function (req, res) {
  res.send('Welcome to our hotel');
})


//Import the router files
const personRoutes = require('./routes/personRoutes');
const MenuItemRoutes = require('./routes/MenuItemRoutes');

//Use the routers
app.use('/person',personRoutes);
app.use('/menu',MenuItemRoutes);


app.listen(PORT, ()=>{
    console.log('listening on port 3000');
})