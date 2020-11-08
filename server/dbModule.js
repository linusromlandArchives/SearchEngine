const mongoose = require('mongoose');
const mongAuth = require('./mongoauth.json')
let db;

exports.cnctDB = (collectionname) => {
  mongoose.connect(
    "mongodb://localhost:27017/" + collectionname,
    {
      "auth": {
        "authSource": "admin"
      },
      "user": mongAuth.username,
      "pass": mongAuth.pass
    }
  );

  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () { });
  console.log("Connected to Database!")
}

exports.getInDB = async (Model, search) => {
  const regex = new RegExp(escapeRegex(search), 'gi');
  return await Model.find({ 
    $and: [{ $or: [{ "name": regex }, { "link": regex }] }, ] }).limit(10)
}

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.findTopinDB = async (Model) => {
  return await Model.find({})
}

exports.saveToDB = (input) => {
  input.save(() => {
    console.log(`Successfully saved ${input} to the database!`)
  })
}