const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
console.log(process.env.FOO);
const db = {};
db.mongoose = mongoose;
db.url = process.env.url;
db.users = require("./user.model")(mongoose);
module.exports = db;