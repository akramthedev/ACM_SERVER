var express = require("express");
var router = express.Router();

const { GetClientTacheDetailsForEmail } = require("../Infrastructure/EmailRepository");

//#region Email

router.get("/GetClientTacheDetailsForEmail", async (request, response) => {
  await GetClientTacheDetailsForEmail(request.query.ClientTacheId)
    .then((res) => {
      console.log(res);
      response.status(200).send(res);
    })
    .catch((error) => response.status(400).send(error));
});

//#endregion Email

module.exports = router;
