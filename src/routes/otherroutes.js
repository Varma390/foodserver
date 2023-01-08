const otherroute = require('express').Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {recipeModal} = require('../modals/loginSchema');

const cors = require("cors");
otherroute.use(cors());

let cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: process.env.CLOUD, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
});

// // for storing files
const multer = require("multer")
const ownStorage = multer.diskStorage({})
const upload = multer({storage:ownStorage})


// middleware for jwt verification
otherroute.use("/", (req, res, next) => {
    if (req.headers.token) {
      const token = req.headers.token;
      console.log(`token = ${token}`)
      if (token) {
        console.log(1)
        jwt.verify(token, process.env.SECRET_TOKEN, function (err, decoded) {
          if (err) {
            return res.status(401).json(err);
          }
          console.log(2)

          console.log(decoded)
          req.user = decoded.data;
          next();
        })
      } else {
        return res.status(401).json({
          status: "Failed",
          message: "Token is missing",
        });
      }
    } else {
      return res.status(403).json({
        status: "Failed",
        message: "Not authenticated user",
      });
    }
});

otherroute.get('/',(req,res) => {
    res.send('success')
})



otherroute.post('/add',upload.single('myImage'),async (req,res) => {
  console.log(req.body,req.file)

    try {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path,{
        upload_preset: 'images'
    })
        let obj = {...req.body,Image: uploadedImage.secure_url, userid:req.user}
        console.log(obj);
        await recipeModal.create(obj)
        .then(data => {
            res.send({
                status: "success",
                mess : data
            })
        })
    } catch(err) {
        res.send({
            status: "failure",
            mess : err.message
        })
    }
})
// otherroute.get('/search',async (req,res) => {
//   await recipeModal.findOne({ userid: req.user, })
//   .then(data => {
//     res.status(200).json({
//         status: "success",
//         mess : data
//       })
//   }) 
//   .catch(err => {
//     res.status(404).json({
//         status: "Failed",
//         message: "User does not exists",
//       })
// })
// })

otherroute.get('/:search',async (req,res) => {
    console.log(req.params.search,req.user);
    try { // Name: req.params.search,
        await recipeModal.findOne({ Name: req.params.search, userid: req.user })
        .then(data => {
          console.log(data);
          if (!data) {
            res.status(200).json({
              status: "Failed",
              message: "recipe does not exist",
              mess: data
            })
          } else {
            res.status(200).json({
              status: "success",
              mess : data
            })
          }
        }) 
        .catch(err => {
          res.status(401).json({
              status: "Failed",
              message: "could not make a search",
            })
        })
      } catch (err) {
        res.status(400).json({
          status: "Failed",
          message: err.message,
        });
      }
})

module.exports = otherroute
