const sql = require("mssql");

const config = {
  server: "SQL6032.site4now.net",
  user: "db_a3973b_acmprod_admin",
  password: "acmprod123456",
  database: "db_a3973b_acmprod",
  options: { encrypt: false },
};

const connect = async () => {
  try {
    await sql.connect(config);
    console.log("SQL server Connection Successful!");
  } catch (err) {
    console.log("sql connection error !!!!! \n\n");
    console.log(err);
    throw err; // Re-throw the error for handling in the main application
  }
};

module.exports = { connect, sql }; // Export the connect function
