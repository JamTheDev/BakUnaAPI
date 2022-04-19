const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
    _id: String,
    auth_key: String
});

module.exports = mongoose.model("Users", UsersSchema)