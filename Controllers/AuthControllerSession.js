var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
// var session = require('express-session');
var crypto = require('crypto');
var router = express.Router();

// router.get('/login', function (req, res, next) {
//     res.send("login")
//     //   res.render('login');
// });
users = [
    { id: "01", username: "amine", hashed_password: "123", salt: "123" },
]
passport.use(new LocalStrategy(function verify(username, password, cb) {
    console.log("check password ........")
    return cb(null, users[0]);
    // db.get('SELECT * FROM users WHERE username = ?', [username], function (err, row) {
    //     if (err) { return cb(err); }
    //     if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    //     crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
    //         if (err) { return cb(err); }
    //         if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
    //             return cb(null, false, { message: 'Incorrect username or password.' });
    //         }
    //         return cb(null, row);
    //     });
    // });
}));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});
router.get("/login", async (request, response) => {
    console.log("getLogin ")
    response.status(200).send("getLOgin");
});

router.post('/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true
}));

module.exports = router;