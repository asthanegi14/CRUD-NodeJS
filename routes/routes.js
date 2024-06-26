const express = require("express");
const router = express.Router();
const User = require('../models/Users');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

var storage = multer.diskStorage({
    destination: function(req, file, callBack){
        callBack(null, './images');
    },
    filename: function(req, file, callBack){
        callBack(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single('image');

router.get("/", (req, res)=>{
    res.render('index');
});

router.post("/add", upload, async (req, res)=>{
    try {
        const colorsArray = req.body.colors.split(',').map(color => color.trim());
        const applicationTypesArray = req.body.applicationTypes.split(',').map(type => type.trim());

        const user = new User({
            name: req.body.name,
            technology: req.body.technology,
            colors: colorsArray,
            pricePerGram: req.body.pricePerGram,
            applicationTypes: applicationTypesArray,
            image: req.file.filename
        });

        await user.save();
        
        req.session.message = {
            type: 'success',
            message: 'Data Added Successfully'
        };

        res.redirect('/');
    } catch (e) {
        res.json({message: e.message, type: 'danger'});
    }
});

router.get("/fetch", async (req, res)=>{
    try {
        const users = await User.find();
        res.render('fetchUser', {
            users: users,
        });
    } catch (e) {
        res.json({message: e.message});
    }
});

router.get("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (user) {
            res.render('updateUser', { user: user });
        } else {
            res.status(404).send("User not found");
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
});

router.post("/update/:id", upload, async (req, res) => {
    try {
        const id = req.params.id;
        const colorsArray = req.body.colors.split(',').map(color => color.trim());
        const applicationTypesArray = req.body.applicationTypes.split(',').map(type => type.trim());

        const updateData = {
            name: req.body.name,
            technology: req.body.technology,
            colors: colorsArray,
            pricePerGram: req.body.pricePerGram,
            applicationTypes: applicationTypesArray
        };

        if (req.file) {
            updateData.image = req.file.filename;
            try{
                fs.unlinkSync("./images/"+req.body.old_image);
            }catch(err){
                console.log(err);
            }
        }

        await User.findByIdAndUpdate(id, updateData);

        req.session.message = {
            type: 'success',
            message: 'Data Updated Successfully'
        };

        res.redirect('/');
    } catch (e) {
        res.status(500).send(e.message);
    }
});



router.get("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        if (user) {
            const imagePath = path.join(__dirname, '../images', user.image);

            await User.findByIdAndDelete(id);

            if (user.image) {
                try {
                    fs.unlinkSync(imagePath);
                } catch (err) {
                    console.error("Error deleting image file:", err);
                }
            }

            req.session.message = {
                type: 'success',
                message: 'User deleted successfully'
            };
        } else {
            req.session.message = {
                type: 'danger',
                message: 'User not found'
            };
        }

        res.redirect('/'); 
    } catch (err) {
        req.session.message = {
            type: 'danger',
            message: err.message
        };
        res.redirect('/'); 
    }
});

module.exports = router;
