const sql = require("mssql");

// dev
// const config = {
//   server: "SQL6032.site4now.net",
//   user: "db_a3973b_acm_admin",
//   password: "acm123456",
//   database: "db_a3973b_acm",
//   options: { encrypt: false },
// };


// prod
// const config = {
//   server: "SQL6032.site4now.net",
//   user: "db_a3973b_acm_admin", //prod:db_a3973b_acmprod_admin  dev:db_a3973b_acm_admin
//   password: "acm123456", //prod:acm123456  dev:acmprod123456
//   database: "db_a3973b_acm", //prod:db_a3973b_acmprod  dev:db_a3973b_acm
//   options: { encrypt: false },
// };

const connect = async (config) => {
  try {
    await sql.connect(config);
    console.log("SQL server Connection Successful!");
  } catch (err) {
    console.log("sql connection error !!!!! \n\n");
    console.log(err);
    throw err;
  }
};

module.exports = { connect, sql }; // Export the connect function
