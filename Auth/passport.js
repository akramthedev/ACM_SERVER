// pasport.js
const { Strategy, ExtractJwt } = require('passport-jwt');
const jwtOptions = {
    secretOrKey: "mukarramjavidsecretKey",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const jwtVerify = async (payload, done) => {
    try {
        // let user = { id: "1a-2b-3c-4d-5e-6f", email: "mukarram@gmail.com", password: "123456789", role: 'admin' };
        // user = user.email === payload.email ? user : {}
        let user = payload
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
};
const jwtStrategy = new Strategy(jwtOptions, jwtVerify);
module.exports = { jwtStrategy }