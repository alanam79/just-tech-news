// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

// loading credentials from the .env file to the 
// environment variables
require('dotenv').config();

// create connection to our database 
// pass in your MySQL login information for username and password
const sequelize = new Sequelize('just_tech_news_db', 'root', 'Mae,hN2Ab-O-', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;