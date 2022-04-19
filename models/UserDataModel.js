const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name: String,
    doses: Number,
    vaccine_brand: String,
    first_dose_date: String,
    second_dose_date: String,
    is_vaccinated: String,
    vaccinator: String,
    vaccination_site: String,
});

module.exports = mongoose.model("malolosbranches", Schema)