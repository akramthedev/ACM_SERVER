// auth.js
const passport = require("passport");

const auth = function (req, res, next) {
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

const hasRole = function (roles = []) {
    console.log("hasRole: ", roles);
    if (!Array.isArray(roles)) roles = [roles];

    return (req, res, next) => {
        next();

        // function sendError(msg) {
        //     return req.res.status(403).json({ message: msg, });
        // }

        // try {
        //     const token = req.headers["Authorization"] || req.headers["authorization"];

        //     if (!token) return sendError("Error: No Token"); // Token does not exist
        //     if (token.indexOf("Bearer") !== 0) return sendError("Error: Token format invalid"); // Wrong format

        //     const tokenString = token.split(" ")[1];
        //     jwt.verify(tokenString, _SecretToken, (err, decodedToken) => {
        //         if (err) {
        //             console.log(err);
        //             return sendError("Error: Broken Or Expired Token");
        //         }

        //         if (!decodedToken.role) return sendError("Error: Role missing");
        //         const userRole = decodedToken.role;
        //         if (roles.indexOf(userRole) === -1)
        //             return sendError("Error: User not authorized");

        //         req.user = decodedToken;
        //         next();
        //     });
        // } catch (err) {
        //     console.log(err);
        //     return req.res.send.status(500).json({ message: "Server Error Occured" });
        // }
    };
}

module.exports = { auth, hasRole };