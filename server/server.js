const express = require("express");
const app = express();

const mongoose=require('mongoose');
require('dotenv/config');

//DB connection
const routerHandler=require('../routes/handler.js');
app.use('/',routerHandler);

console.log("Trying to connect");
mongoose.connect("mongodb+srv://swadmin:^squarewheels^@cluster0.jbqjs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser:true, useUnifiedTopology:true})
.then( () => {
  console.log("DB connected");
})
.catch( (err) => {
  console.log(err);
});
console.log("Finish connect");

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});