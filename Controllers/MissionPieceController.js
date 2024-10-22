var express = require("express");
var router = express.Router();
const { GetMissionPieces } = require("../Infrastructure/MissionPieceRepository");
const log = require("node-file-logger");

//#region MissionPiece
router.get("/GetMissionPieces", async (request, response) => {
  await GetMissionPieces(request.query.MissionId)
    .then((res) => {
      // log.Info(`GetMissionPieces : ${JSON.stringify(res)} , efféctuer par :${request.kauth.grant.access_token.content.preferred_username} , userId: ${request.kauth.grant.access_token.content.sid}`,request.query.MissionId);

      // log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      // log.Error(`GetMissionPieces Error: ${error} , efféctuer par :${request.kauth.grant.access_token.content.preferred_username} , userId: ${request.kauth.grant.access_token.content.sid}`,request.query.MissionId);

      // log.Info(error);
      response.status(400).send(error);
    });
});

//#endregion MissionPiece

module.exports = router;
