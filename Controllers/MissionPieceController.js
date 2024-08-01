var express = require("express");
var router = express.Router();
const { GetMissionPieces } = require("../Infrastructure/MissionPieceRepository");

//#region MissionPiece
router.get("/GetMissionPieces", async (request, response) => {
  await GetMissionPieces(request.query.MissionId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});

//#endregion MissionPiece

module.exports = router;
