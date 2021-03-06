var express = require('express');
var router = express.Router();
import * as moment from 'moment';
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
const nodemailer = require('nodemailer');
const nodeCrypto = require('crypto');
var RateLimit = require('express-rate-limit');

var models = require('../../../models').getModels();
var queries = require('../../queries/queries');

// If doing development work with the password reset stuff just set these vars to your gmail account and password
// and change the from variable to your gmail
// Thanks to answer from https://stackoverflow.com/questions/19877246/nodemailer-with-gmail-and-nodejs/#answer-27160641
// You need to make sure you're logged in and navigate to the below link and enable
// https://www.google.com/settings/security/lesssecureapps

let developmentEmail = '';
let developmentPassword = '';
let from = '"ZackFanning" <zackfsocialnetwork@gmail.com>';

const config = {
  loginLimiter: new RateLimit({
    windowMs: 15*60*1000, // 15 minutes 
    max: 20, // limit each IP to 20 requests per windowMs 
    delayMs: 0 // disable delaying - full speed until the max limit is reached 
  }),
  // passport local and jwt
  localOptions: { usernameField: 'email' },
  jwtOptions: { 
    secretOrKey: process.env.SECRET || 'secret',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  },
  // nodemailer transport object
  transporterConfig: {
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || developmentEmail,
      pass: process.env.GMAIL_PASSWORD || developmentPassword
    }
  } 
}

let token;
let payload;

passport.use(new JwtStrategy(config.jwtOptions, (jwt_payload, next) => {
  queries.users.getUserJwt(jwt_payload.id)
  .then(user => {
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  }).catch(err => next(err));
}));

passport.use(new LocalStrategy(config.localOptions,(email, password, done) => {
  queries.users.getUser(email)
  .then(user => {
    if (user == null) {
      return done(null, false, { message: 'Incorrect Username/Email' })
    }
    if (user.password === password) {
      payload = { id: user.id };
      token = jwt.sign(payload, config.jwtOptions.secretOrKey, { expiresIn: 1000000})
      return done(null, user)
    }
    return done(null, false, { message: 'Incorrect Password' })
  }).catch(err => done(err));
}));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  models.users.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


var routeBuilder = path => {

  /**
   * @api {post} /authentication/register Create User
   * @apiName CreateUser
   * @apiGroup Authentication
   * 
   * @apiParam {Body}     -                    Post Body.
   * @apiParam {String}   -.firstName          User First Name.
   * @apiParam {String}   -.lastName           User Last Name.
   * @apiParam {Date}     -.birthday           Users Birthday.
   * @apiParam {String}   -.username           Users Username.
   * @apiParam {String}   -.email              Users Email.
   * @apiParam {String}   -.password           Users Password.
   *
   * 
   * @apiSuccess {Success}      -.success        Success object.
   * 
   */
  router.post(`${path}/register`, (req, res, next) => {
    let user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthday: req.body.birthday, 
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }
    queries.users.createUser(user)
      .then(success => res.status(201).json(success))
      .catch(error => next(error))
  });

  /**
   * @api {post} /authentication/login User Login
   * @apiName UserLogin
   * @apiGroup Authentication
   * 
   * @apiParam {Body}     -                    Post Body.
   * @apiParam {String}   -.email              Users Email/Username.
   * @apiParam {String}   -.password           Users Password.
   *
   * 
   * @apiSuccess {Success}      -.success        Success object.
   * 
   */
  router.post(`${path}/login`, config.loginLimiter, passport.authenticate('local', { session: false }), (req, res, next) => {
    res.json({ message: "Authorized", id: payload.id, token: token });
  });

  /**
   * @api {get} /authentication/logout User Logout
   * @apiName UserLogout
   * @apiGroup Authentication
   * 
   * @apiSuccess {Success}      -.success        Success object.
   * 
   */
  router.get(`${path}/logout`, (req, res, next) => {
    req.logout();
    res.status(200).send({ message: 'Logged Out' });
  });

  /**
   * @api {post} /authentication/password-reset Password Reset
   * @apiName PasswordReset
   * @apiGroup Authentication
   * 
   * @apiParam {Body}     -                    Post Body.
   * @apiParam {String}   -.email              Users Email/Username.
   *
   * 
   * @apiSuccess {Success}      -.success        Success object.
   * 
   */
  router.post(`${path}/password-reset`, (req, res, next) => {
    queries.users.getUser(req.body.email)
    .then(user => {
      nodeCrypto.randomBytes(48, (err, buffer) => {
        const resetToken = buffer.toString('hex');
        if(err) { 
          return next(err)
        };
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = moment().add(15, 'm').format('YYYY-MM-DD HH:mm');
        user.save()
          .then(success => {
            const message = {
              subject: 'Reset Password for Social Network',
              message: `${'You are receiving this because you (or someone else) have requested the reset of your password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://'}${req.headers.host}/login/reset-password/${resetToken}\n\n` +
              `If you did not request this, please ignore this email and your password will remain unchanged. \n`
            };

            const transporter = nodemailer.createTransport(config.transporterConfig);
            const mailOptions = {
              from: from,
              to: user.email,
              subject: message.subject,
              text: message.message
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if(error) {
                return console.log(error);
              }
            });
            res.status(200).json({ message: 'Please check your email for the link to reset your password. Reset link expires in 15 minutes' });
          })
          .catch(err => {
            res.status(400).json({ message: 'Your request could not be processed as entered. Please try again.'})
          })
      });
    })
  });

  /**
   * @api {post} /authentication/change-password Change Password
   * @apiName ChangePassword
   * @apiGroup Authentication
   * 
   * @apiParam {Body}     -                    Post Body.
   * @apiParam {String}   -.passwordResetToken Users Password Reset Token.
   *
   * 
   * @apiSuccess {Success}      -.success        Success object.
   * 
   */
  router.post(`${path}/change-password`, (req, res) => {
    queries.users.changePassword(req.body.passwordResetToken)
      .then(user => {
        // moment().diff(Date) gets the difference between the input date and the current date
        let isTokenValid = moment().diff(moment(user.resetPasswordExpires, 'YYYY-MM-DD HH:mm')) < 0;
        if(!isTokenValid){
          throw 'Your token has expired. Please attempt to reset your password again.';
        }
        user.password = req.body.password;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        user.save()
          .then(success => {
            const message = {
              subject: 'Password Changed',
              message: 'You are receiving this email because you changed your password. \n\n' +
                'If you did not request this change, please contact us immediately.'
            };

            const transporter = nodemailer.createTransport(config.transporterConfig);
            const mailOptions = {
              from: from,
              to: user.email,
              subject: message.subject,
              text: message.message
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if(error) {
                return console.log(error);
              }
            });
        res.status(200).json({ message: 'Password succesfully changed.'});
      })
      .catch(err => res.status(400).json({ message: err.message }))
    });
  });

  return router;
}

module.exports = routeBuilder;