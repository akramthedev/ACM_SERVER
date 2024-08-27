// auth.js
const passport = require("passport");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let jwtConfig = {
    secretKey: "acm-secret-jwt-key",
    tokenType: "access",
    iss: 'amine@netwaciila.ma',
    tokenLifespanShort: 15, // 15 min
    tokenLifespanLong: 10 * 60,// 10 h
}
const auth0 = function (req, res, next) {
    console.log("auth ....")
    // console.log("roles: ", roles)
    let responseObj = {
        statusCode: 0,
        errorMsg: "",
        data: {}
    }
    passport.authenticate('jwt', { session: false, }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            responseObj.data = info.message
            responseObj.statusCode = 401
            responseObj.errorMsg = "user is not authenticated!!!!"
            return res.status(responseObj.statusCode).json(responseObj)
        }
        console.log("auth.user: ", user);
        req.user = user;
        next();
    })(req, res, next);
}

// const auth = function (req, res, next) {
const auth = (requiredRole) => (req, res, next) => {
    console.log("auth ... requiredRole: ", requiredRole)
    // console.log("roles: ", roles)
    let responseObj = { statusCode: 0, errorMsg: "", data: {} };
    passport.authenticate('jwt', { session: false, }, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            responseObj.data = info.message
            responseObj.statusCode = 401
            responseObj.errorMsg = "user is not authenticated!!!!"
            return res.status(responseObj.statusCode).json(responseObj)
        }
        console.log("auth.user.roles: ", user.roles);
        req.user = user;
        next();
    })(req, res, next);
}


function generateJWTToken(user) {
    let today = new Date();
    let expirationDate = new Date(today);
    if (user.StayConnected == false)
        expirationDate.setMinutes(today.getMinutes() + jwtConfig.tokenLifespanShort);
    else
        expirationDate.setMinutes(today.getMinutes() + jwtConfig.tokenLifespanLong);

    let payload = {
        UserId: user.UserId,
        Email: user.Email,
        Username: user.Username,
        PhoneNumber: user.PhoneNumber,
        iat: parseInt(today.getTime() / 1000, 10),
        exp: parseInt(expirationDate.getTime() / 1000, 10),
        sub: user.Email,
        iss: jwtConfig.iss,
        Roles: user.Roles,
    }
    let token = jwt.sign(payload, jwtConfig.secretKey)
    return { JWTToken: token, ExpirationDate: expirationDate };
}

// const verifyToken = (requiredRole) => (req, res, next) => {
//     console.log("verifyToken: ", requiredRole)
//     // const token = req.cookies.token;
//     const token = req.headers.authorization.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//     }

//     jwt.verify(token, jwtConfig.secretKey, (err, decoded) => {
//         if (err) return res.status(401).json({ message: 'Invalid token' });


//         console.log("decoded: ", decoded)
//         req.id = decoded.id;
//         req.email = decoded.email;

//         if (decoded.role !== requiredRole) {
//             return res.status(403).json({
//                 message: 'You do not have the authorization and permissions to access this resource.'
//             });
//         }

//         next();
//     });
// };


module.exports = { auth, generateJWTToken };