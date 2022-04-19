const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    vaccinated: {
        type: Array,
        default: [{
            name: String,
            doses: Number,
            vaccine_brand: String,
            first_dose_date: String,
            second_dose_date: String,
            is_vaccinated: String,
            vaccinator: String,
            vaccination_site: String,
            booster_shot_info: {
                type: Array,
                default: {
                    booster_brand: String,
                    vaccinator: String,
                    vaccination_site: String
                }
            }
        }]
    },
    non_vaccinated: {
        type: Array,
        default: [
            [{
                name: String,
                doses: Number,
                vaccine_brand: String,
                first_dose_date: String,
                second_dose_date: String,
                is_vaccinated: String,
                vaccinator: String,
                vaccination_site: String,
                booster_shot_info: {
                    type: Array,
                    default: {
                        booster_brand: String,
                        vaccinator: String,
                        vaccination_site: String
                    }
                }
            }]
        ]
    }
});

module.exports = mongoose.model("guiguintobranches", Schema)