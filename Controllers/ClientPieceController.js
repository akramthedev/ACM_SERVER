var express = require('express');
const fs = require('fs');
const fileUpload = require('express-fileupload');
var router = express.Router();
const { CreateClientPiece, DeleteClientPiece, GetClientPiece } = require('../Infrastructure/ClientPieceRepository');
const { GetPieces, } = require('../Infrastructure/PieceRepository');

//#region ClientPiece
router.get("/GetClientPieces", async (request, response) => {
    let filename = "./Pieces/0.log";
    try {
        let exists = fs.existsSync(filename);
        console.log("exists: ", exists)
        if (exists) {
            fs.unlinkSync(filename)
            response.status(200).send("done");
        }
        else
            response.status(200).send("file not found");
    } catch (e) {
        response.status(200).send("Error delete file");
    }
});
router.get("/GetPieces", async (request, response) => {
    await GetPieces()
        .then((res) => response.status(200).send(res))
        .catch((error) => response.status(400).send(error))
});
router.post('/CreateClientPiece', async (request, response) => {
    let ClientId = request.body.ClientId;
    // let PieceId = request.body.PieceId;
    let ClientPieceId = request.body.ClientPieceId;
    let ClientPiecesDirectory = `./Pieces/${ClientId}`;

    if (!request.files || Object.keys(request.files).length === 0)
        return response.status(400).send('No files were uploaded.');

    let fileToUpload = request.files.file;
    // let mimetype = fileToUpload.mimetype;
    let fileExtension = fileToUpload.name.split(".")[fileToUpload.name.split(".").length - 1];

    // create ClientPiecesDirectory if it doesn't exist
    let exists = fs.existsSync(ClientPiecesDirectory);
    if (!exists) fs.mkdirSync(ClientPiecesDirectory);

    let uploadPath = `${ClientPiecesDirectory}/${ClientPieceId}.${fileExtension}`;

    // Use the mv() method to place the file somewhere on your server
    fileToUpload.mv(uploadPath, async function (err) {
        if (err) return response.status(500).send(err);
        // create ClientPiece
        // response.status(200).send('File uploaded!');
        let newClientPiece = {
            ClientPieceId: request.body.ClientPieceId,
            ClientId: request.body.ClientId,
            PieceId: request.body.PieceId,
            Extension: fileExtension,
        };
        await CreateClientPiece(newClientPiece)
            .then((res) => {
                response.status(200).send(res);
            }, (err) => {
                response.status(500).send(err);
            })
    });
});
router.delete("/DeleteClientPiece/:ClientPieceId", async (request, response) => {
    // get ClientPiece
    await GetClientPiece(request.params.ClientPieceId)
        .then(async (res) => {
            if (res != null && res.length == 1) {
                let clientPiece = res[0];
                let fileNameToDelete = `./Pieces/${clientPiece.ClientId}/${clientPiece.ClientPieceId}.${clientPiece.Extension}`;
                if (fs.existsSync(fileNameToDelete)) {
                    fs.rmSync(fileNameToDelete);

                    await DeleteClientPiece(request.params.ClientPieceId)
                        .then((res) => response.status(200).send(res))
                        .catch((error) => response.status(400).send(error))
                }
                else
                    response.status(200).send("not found");
            }
        })
        .catch((error) => response.status(400).send(error));
});
//#endregion ClientPiece

module.exports = router;