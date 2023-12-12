const mongoose = require('mongoose')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/users')

exports.users_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .then(user => {
      if (user.length >= 1) {
        res.status(409).json({
          message: 'Email already exists'
        })
      } else {
        bcrypt
          .hash(req.body.password, 10)
          .then(hash => {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            })
            user
              .save()
              .then(result => {
                res.status(201).json({
                  message: 'User created successfully',
                  created: result
                })
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                })
              })
          })
          .catch(err => {
            res.status(500).json({
              error: err
            })
          })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.users_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .then(user => {
      bcrypt
        .compare(req.body.password, user[0].password)
        .then(result => {
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              process.env.JWT_KEY,
              {
                expiresIn: '1h'
              }
            )

            res.status(200).json({
              message: 'Authentication successful',
              token: token
            })
          } else {
            res.status(401).json({
              message: 'Authentication failed'
            })
          }
        })
        .catch(err => {
          res.status(401).json({
            message: 'Authentication failed'
          })
        })
    })
    .catch(err => {
      res.status(401).json({
        message: 'Authentication failed'
      })
    })
}

exports.users_delete = (req, res, next) => {
  const id = req.params.userId

  User.findById(id)
    .then(user => {
      if (user) {
        if (user._id == req.userData.userId) {
          user
            .deleteOne()
            .then(result => {
              res.status(200).json({
                message: 'User deleted successfully'
              })
            })
            .catch(err => {
              res.status(500).json({
                error: err
              })
            })
        } else {
          res.status(401).json({
            message: 'Unauthorized request'
          })
        }
      } else {
        res.status(404).json({
          message: 'User does not exist'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.users_get_all = (req, res, next) => {
  User.find({})
    .then(users => {
      res.status(200).json({
        count: users.length,
        users: users.map(user => {
          return {
            email: user.email,
            _id: user._id
          }
        })
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}