//AuthController.js
var express = require('express');
const { GetUser, GetUserRoles } = require('../Infrastructure/UserRepository');
const { auth, generateJWTToken } = require('../Auth/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

var router = express.Router();


router.get("/admin", auth('role1', 'role2'), auth('role3'), (req, res) => {
    let body = req.body
    res.status(200).send("admin");
})

router.get("/user", auth('role1'), auth('role2'), (req, res) => {
    let body = req.body
    res.status(200).send("user");
})


router.post("/Login", async (request, response) => {
    let { Login, Password, StayConnected } = request.body
    // console.log("/post.login: ", Login, Password, StayConnected);
    await GetUser(Login)
        .then((res) => {
            console.log("getuser: ", res)
            if (res == null || res.length == 0)
                response.status(403).send("Login ou mot de passe incorrect");
            else {
                let user = res[0];
                bcrypt.compare(Password, user.PasswordHash, async function (err, result) {
                    if (!result) response.status(403).send("Login ou mot de passe incorrect !!!");
                    else
                        await GetUserRoles(user.UserId)
                            .then((resRoles) => {
                                user.Roles = resRoles.map(x => x.Libelle);
                                user.StayConnected = StayConnected;
                                let tokenObj = generateJWTToken(user)
                                // let expirationDate = `${tokenObj.ExpirationDate.toLocaleDateString()} ${tokenObj.ExpirationDate.toLocaleTimeString()}`;
                                let expirationDate = tokenObj.ExpirationDate.toLocaleString();
                                user.tokenType = 'Bearer';
                                let responseObj = {
                                    UserId: user.UserId,
                                    Username: user.Username,
                                    Email: user.Email,
                                    PhoneNumber: user.PhoneNumber,
                                    expirationDate: expirationDate,
                                    token: tokenObj.JWTToken,
                                };
                                response.status(200).send(responseObj);
                            })
                            .catch((errRoles) => response.status(400).send(errRoles));
                });
            }
        })
        .catch((error) => response.status(400).send(error))
    /*
        if (email != undefined && password != undefined) {
            let DBUser = [
                { id: "11", email: "admin", password: "123", roles: ["role1", "role2", "role3"], },
                { id: "22", email: "user1", password: "123", roles: ["role1", "role2"], },
                { id: "33", email: "user2", password: "123", roles: ["role2", "role3"], },
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
    */
    // res.status(responseObj.statusCode).send(responseObj.data)
})


// router.post('/login', passport.authenticate('local', {
//     successReturnToOrRedirect: '/',
//     failureRedirect: '/login',
//     failureMessage: true
// }));

module.exports = router;