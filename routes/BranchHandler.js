// .env requirement
require("dotenv").config();
// imports
const express = require("express");
var Model = require("../models/MalolosBranchModel");
const router = express.Router();

// branch with kvp
const branchWithKeys = {
    "malolos": "../models/MalolosBranchModel",
    "calumpit": "../models/CalumpitBranchModel",
    "guiguinto": "../models/GuiguintoBranchModel"
} 

function validate(key) {
  return key == process.env["API_KEY"];
}

// getting a branch
router.get("/get", getBranch, async (req, res) => {
    
    try{
        
        if(req.query.branch_city == "all" && req.query.branch_location == "all") {
            let finalResult = {};

            var promise = new Promise( async (resolve) => {
                for await (let [key, value] of Object.entries(branchWithKeys)) {
                    Model = require(value);
                    var branch = await Model.find();

                    for await (const val of branch) {
                        var temp = {
                            [val["_id"]]: {
                                "vaccinated_count": val["vaccinated"].length,
                                "non_vaccinated": val["non_vaccinated"].length
                            }
                        }

                        finalResult = Object.assign(finalResult, temp);
                    }

                    
                }
                resolve();
            })

            promise.then(() => {
                res.status(201).json({"branches": finalResult});
            })      
            return;
        }

        if(req.query.status != "all") {
            return res.status(201).json({
                [req.query.status]: res.branch[req.query.status]
            });
        }

        return res.status(201).json(res.branch);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
    
}) 

router.post("/post", (req, res) => {
    if (!validate(req.query.key)) return res.status(400).json({
      status: 400,
      message: "Wrong API key! Please try again."
    });
  
    const newData = new Model({
        _id: req.body.id,
        auth_key: req.body.auth_key
    })

    newData.save().exec().then(data => {
        res.json(data);
    }).catch(err => {
        res.json({error: err})
    })
}) 

// update user info
router.patch("/update/:user_id", getBranch, async (req, res) => {
    // can only push ONE

  if (!validate(req.query.api_key)) return res.status(400).json({
      status: 400,
      message: "Wrong API key! Please try again."
    });
  
    
    let itemIndex = res.branch.vaccinated.findIndex(x => x._id === req.params.user_id);
    let nonVacUid = res.branch.non_vaccinated.findIndex(x => x._id === req.params.user_id);
    
    if(itemIndex > -1){
      res.branch.vaccinated[itemIndex] = req.body.vaccinated;
      res.branch.vaccinated[itemIndex]._id = req.params.user_id;
    } else {
      res.branch.vaccinated.push(req.body.vaccinated);
    }

    if(nonVacUid > -1) {
      res.branch.non_vaccinated.splice(res.branch.vaccinated[itemIndex], 1);
    }

    try {
        // push to db
        const newEmployee = await res.branch.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({message:err.message});
    }
}) 

// create user db
router.put("/create", getBranch, async (req, res) => {

    if(req.body.non_vaccinated != null) {
      res.branch.non_vaccinated.push(req.body.non_vaccinated);
    } else {
      res.branch.vaccinated.push(req.body.vaccinated);
    }
    

    try {
        const newEmployee = await res.branch.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({message:err.message});
    }
}) 

async function getBranch(req, res, next) {
    if (!validate(req.query.key)) return res.status(400).json({
        status: 400,
        message: "Wrong API key! Please try again."
      });
    let branch;
    if(req.query.branch_city == "all" && req.query.branch_location == "all") {
        next();
        return;
    }
    Model = require(branchWithKeys[req.query.branch_city]);
    try {
        branch = await Model.findById(req.query.branch_location);
        if(branch == null) {
            return res.status(404).json({ message: "Couldn't find branch!"});
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.branch = branch;
    next();
}


function getId(){
    return '_' + Math.random().toString(36).substring(2, 9).toString();
};

module.exports = router;