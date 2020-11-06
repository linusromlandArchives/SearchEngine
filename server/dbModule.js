const mongoose = require('mongoose');
let db;

exports.cnctDB = (collectionname) => {
  let dbLink = `mongodb://localhost/${collectionname}`
  mongoose.connect(dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () { });

}

exports.getInDB = async (Model, search) => {
  const regex = new RegExp(escapeRegex(search), 'gi');
  await db.collection("links").find({ $and: [{ $or: [{ "name": regex }, { "link": regex }] }, ] }, { fields: { _id: 0, link: 1, name: 1 } }).limit(10).toArray(function (err, result) {
      if (err) throw err;
       return result
  });
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