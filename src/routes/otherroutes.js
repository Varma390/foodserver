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

otherroute.post('/add',async (req,res) => {
  console.log(req.body,req.file)

    try {

   
        let obj1 = {
          "Name": "pizza",
          "Image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
          "Ingredients": [
              "2\/3 cup pank",
              "1\/4 teaspoon red pepper flakes",
              "1\/2 lemon, zested and juiced",
              "1 extra-large egg yolk",
              "1 teaspoon rosemary, minced",
              "3 tablespoon parsley, minced",
              "4 clove garlic, minced",
              "1\/4 cup shallots, minced",
              "8 tablespoon unsalted butter, softened at room temperature",
              "2 tablespoon dry white wine",
              "Freshly ground black pepper",
              "Kosher salt",
              "3 tablespoon olive oil",
              "2 pound frozen shrimp"
          ],
          "Steps": [
              "Place beef roast in crock pot.",
              "Mix the dried mixes together in a bowl and sprinkle over the roast.",
              "Pour the water around the roast.",
              "Cook on low for 7-9 hours."
          ],
          "Description": "Preheat the oven to 425 degrees F.Defrost shrimp by putting in cold water, then drain and toss with wine, oil, salt, and pepper. Place in oven-safe dish and allow to sit at room temperature while you make the butter and garlic mixture.In a small bowl, mash the softened butter with the rest of the ingredients and some salt and pepper.Spread the butter mixture evenly over the shrimp. Bake for 10 to 12 minutes until hot and bubbly. If you like the top browned, place under a broiler for 1-3 minutes (keep an eye on it). Serve with lemon wedges and French bread.Note: if using fresh shrimp, arrange for presentation. Starting from the outer edge of a 14-inch oval gratin dish, arrange the shrimp in a single layer cut side down with the tails curling up and towards the center of the dish. Pour the remaining marinade over the shrimp. ",
          "userid":req.user,
        }
        await recipeModal.create(obj1)
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

// otherroute.post('/add',upload.single('myImage'),async (req,res) => {
//   console.log(req.body,req.file)

//     try {
//       const uploadedImage = await cloudinary.uploader.upload(req.file.path,{
//         upload_preset: 'images'
//     })
//         let obj = {...req.body,Image: uploadedImage.secure_url, userid:req.user}
//         console.log(obj);
//         await recipeModal.create(obj)
//         .then(data => {
//             res.send({
//                 status: "success",
//                 mess : data
//             })
//         })
//     } catch(err) {
//         res.send({
//             status: "failure",
//             mess : err.message
//         })
//     }
// })
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