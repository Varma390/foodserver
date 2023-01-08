// const express = require('express').Router;
const loginroute = require('express').Router();
const {UserModal} = require('../modals/loginSchema');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const cors = require("cors");
loginroute.use(cors());

loginroute.get('/signup', (req,res) => {
    res.status(200).json({
        status : "success",
        message : "all good"
    })
})

loginroute.post('/signup', async (req,res) => {
    console.log(req.body)
    const {Email, Password, confirmPassword} = req.body
    try {
        await UserModal.findOne({Email})
        .then(data => {
            if (data) { // if user already exists
                console.log(1)
                res.status(409).send({
                    status: "Failed",
                    message: "User already exists with the given email. Please proceed to sign in",
                    data: "ravi"
                  })   
            } else { // if not exists
                if (Password !== confirmPassword) { // if passwords wont match
                console.log(2)
                res.status(400).send({
                    status: "Failure",
                    message: "Password and confirm password are not matching",
                    
                  })
                }else {
                bcrypt.hash(Password, 10) // encrypt the password
                .then(async hash => { // if successful
                    await UserModal.create({ // add user to database
                        Email: Email,
                        Password: hash,
                        // name: Email.split("@")[0],
                    })
                    .then( userdata => { // if succeessful display the added user
                console.log(3)

                        res.status(200).send({
                            status: "Success",
                            message: "User successfully created",
                            Data : userdata
                          })
                    })
                })
                .catch (err => { // if encryption failed show error
                    res.status(500).json({
                        status: "Failed",
                        message: err.message,
                      })
                })}
            }
        })
        .catch(err => { // if found error while searching the user in database
            console.log(4)

            res.status(400).json({
                status: "failed",
                message: err.message
              }) 
        })  
    } catch (err) { // if error while working in this current route
        console.log(5)

        res.json({
            status: "Failed",
            message: err.message,
          })
    }
})

loginroute.post('/login', async (req,res) => {
    console.log(req.body)
    const {Email, Password} = req.body
    try {
        await UserModal.findOne({Email}) // finding user in DB
        .then(data => {
            console.log(data);
            if (!data) { // if user not found data=null
                res.status(409).json({
                    status: "Failed",
                    message: "User doesnt exist with the given email. Please proceed to sign up"
                  }) 
            }
            else {
               // (async function (){ // immediately invoked function
                     bcrypt.compare(Password, data.Password) // comapring the password in DB
                    .then(() => { // if all good
                        console.log(data._id);
                        if (data) {
                            const token = jwt.sign({ // generate token
                                exp: Math.floor(Date.now() / 1000) + 60 * 60,
                                data: data._id
                            }, process.env.SECRET_TOKEN)
                            console.log(1);
                            res.status(200).json({
                                status: "Success",
                                message: "User Logged in successfully",
                                Token: token,
                              });
                        } else { // if password encryption failed
                            res.status(409).json({
                                status: "password encryptition Failed",
                                message: 'err.message'
                              }) 
                        }
                        
                    })
                    // .catch(err => { 
                    
                    // })
                   // })();        
        }})
        .catch(err => { // fetching from DB fail
            res.status(400).json({
                status: "Failed - cant access database",
                message: err.message,
              })
        })
    } catch(err) { // if error while working in this current route
        res.status(400).json({
            status: "Failed",
            message: err.message,
          })
    }
})
module.exports = loginroute