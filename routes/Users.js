// .env requirement
require("dotenv").config();
const express = require("express");
const UserModel = require("../models/UserModel");
const router = express.Router();

router.get("/get", async (req, res) => {
    if(req.query.key != process.env["API_KEY"]) return res.status(400).json({
      status: 400,
      message: "Wrong API key! Please try again."
    });
    try {
        const users = await UserModel.find();
        res.status(201).json(users);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
}) 

router.post("/post", (req, res) => {
    if(req.query.key != process.env["API_KEY"]) return res.status(400).json({
      status: 400,
      message: "Wrong API key! Please try again."
    });
  
    const newData = new UserModel({
        _id: req.body.id,
        auth_key: req.body.auth_key
    })

    newData.save().exec().then(data => {
        res.json(data);
    }).catch(err => {
        res.json({error: err})
    })
}) 

module.exports = router;