// .env requirement
require("dotenv").config();
const express = require("express");
const UserModel = require("../models/UserModel");
const router = express.Router();

router.get("/validate", async (req, res) => {
    if(req.query.key != process.env["API_KEY"]) return res.status(400).json({
      status: 400,
      message: "Wrong API key! Please try again."
    });
    try {
        var branch = req.query.branch;
        var branch_loc = req.query.auth_key;
        const users = await UserModel.find();
        users.forEach((val, index) => {
            if(val["auth_key"] === branch_loc) {
              return res.status(201).json({response: 1});
            }
        });
        res.status(400).json({response: -1});
    } catch (err) {
        res.status(500).json({response: err.message});
    }
}) 

module.exports = router;