const nodemailer = require('nodemailer');


let mailer = nodemailer.createTransport({
    host: 'mail.netwaciila.ma',
    port: 465,
    secure: true,
    auth: {
        user: 'acm@netwaciila.ma',
        pass: 'H(kUmx)pfy0K'
    },
    tls: {
        rejectUnauthorized: false,
    },
});



module.exports = mailer;