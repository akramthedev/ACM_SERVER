var express = require("express");
var router = express.Router();
const { CreatePassif, UpdatePassif, DeletePassif, GetPassifs } = require("../Infrastructure/PassifRepository");
const log = require("node-file-logger");

//#region Passif
router.get("/GetPassifs", async (request, response) => {
  await GetPassifs(request.query.ClientId)
    .then((res) => {
      // log.Info(`Get Passifs : ${JSON.stringify(res)} , efféctuer par :${request.kauth.grant.access_token.content.preferred_username} , userId: ${request.kauth.grant.access_token.content.sid}`,request.query.ClientId);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      // log.Error(`Get Passifs Error: ${error} , efféctuer par :${request.kauth.grant.access_token.content.preferred_username} , userId: ${request.kauth.grant.access_token.content.sid}`,request.query.ClientId);

      // log.Info(error);
      response.status(400).send(error);
    });
});
router.post("/CreatePassif", async (request, response) => {
  await CreatePassif(request.body)
    .then((res) => {
      log.Info(`CreatePassif : ${res} , efféctuer par :${request.kauth.grant.access_token.content.preferred_username} , userId: ${request.kauth.grant.access_token.content.sid}`,request.body);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Error(`CreatePassif Error: ${error} , efféctuer par :${request.kauth.grant.access_token.content.preferred_username} , userId: ${request.kauth.grant.access_token.content.sid}`,request.body);

      // log.Info(error);
      response.status(400).send(error);
    });
});
router.put("/UpdatePassif", async (request, response) => {
  await UpdatePassif(request.body)
    .then((res) => {
      log.Info(`UpdatePassif : ${JSON.stringify(res)} , efféctuer par :${request.kauth.grant.access_token.content.preferred_username} , userId: ${request.kauth.grant.access_token.content.sid}`,request.body);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Error(`UpdatePassif Error: ${error} , efféctuer par :${request.kauth.grant.access_token.content.preferred_username} , userId: ${request.kauth.grant.access_token.content.sid}`,request.body);

      // log.Info(error);
      response.status(400).send(error);
    });
});
router.delete("/DeletePassif/:PassifId", async (request, response) => {
  await DeletePassif(request.params.PassifId)
    .then((res) => {
      log.Info(`DeletePassif : ${res} , efféctuer par :${request.kauth.grant.access_token.content.preferred_username} , userId: ${request.kauth.grant.access_token.content.sid}`,request.params.PassifId);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Error(`DeletePassif Error: ${error} , efféctuer par :${request.kauth.grant.access_token.content.preferred_username} , userId: ${request.kauth.grant.access_token.content.sid}`,request.params.PassifId);

      // log.Info(error);
      response.status(400).send(error);
    });
});
//#endregion Passif

module.exports = router;
