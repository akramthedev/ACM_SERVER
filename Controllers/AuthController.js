//router.js
var express = require('express');
const { auth, hasRole } = require('../Auth/auth');
const jwt = require('jsonwebtoken');

var router = express.Router();


router.get("/admin", auth, (req, res) => {
    let body = req.body
    res.status(200).send("admin");
})

router.get("/user", auth, (req, res) => {
    let body = req.body
    // console.log("==> ", req.user);
    res.status(200).send("user");
})


let config = {
    secretKey: "mukarramjavidsecretKey",
    tokenType: "access"
}

router.post("/login", (req, res) => {
    let { email, password } = req.body
    console.log("/post.login: ", email, password)
    let responseObj = {
        statusCode: 0,
        errorMsg: "",
        data: {}
    }

    if (email != undefined && password != undefined) {
        let DBUser = [
            { id: "11", email: "admin", password: "123", role: "admin" },
            { id: "22", email: "user1", password: "123", role: "user" },
            { id: "33", email: "user2", password: "123", role: "user" },
        ];
        DBUser = DBUser.find(u => u.email === email)
        if (DBUser != null && email === DBUser.email && password === DBUser.password) {
            responseObj.statusCode = 200
            responseObj.errorMsg = ""

            let tokenObj = generateJWTToken(DBUser)

            DBUser.token = tokenObj.JWTToken;
            DBUser.expirationDate = `${tokenObj.ExpirationDate.toLocaleDateString()} ${tokenObj.ExpirationDate.toLocaleTimeString()}`;
            DBUser.tokenType = 'Bearer';
            responseObj.data = DBUser

        } else {
            responseObj.statusCode = 404
            responseObj.errorMsg = "email/password do not match!!"
            console.log("email/password do not match!!");
        }
    }

    res.status(responseObj.statusCode).json(responseObj)
})

function generateJWTToken(user) {
    let today = new Date();
    let expirationDate = new Date(today);
    expirationDate.setMinutes(today.getMinutes() + 60)

    let payload = {
        id: user.id,
        email: user.email,
        iat: parseInt(today.getTime() / 1000, 10),
        exp: parseInt(expirationDate.getTime() / 1000, 10),
        sub: user.email,
        iss: 'admin@gmail.com',
        roles: [user.role],
        permissions: [
            user.role
        ]
    }


    let token = jwt.sign(payload, config.secretKey)
    return { JWTToken: token, ExpirationDate: expirationDate }

}

// router.post('/login', passport.authenticate('local', {
//     successReturnToOrRedirect: '/',
//     failureRedirect: '/login',
//     failureMessage: true
// }));

module.exports = router;