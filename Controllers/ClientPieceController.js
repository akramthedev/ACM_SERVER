var express = require("express");
const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");
var router = express.Router();
const { CreateClientPiece, DeleteClientPiece, GetClientPiece, UpdateClientPiece, GetClientPieces } = require("../Infrastructure/ClientPieceRepository");
const { GetPieces } = require("../Infrastructure/PieceRepository");
const log = require("node-file-logger");

//#region ClientPiece
router.get("/GetClientPieces", async (request, response) => {
  let filename = "./Pieces/0.log";
  try {
    let exists = fs.existsSync(filename);
    console.log("exists: ", exists);
    if (exists) {
      fs.unlinkSync(filename);
      response.status(200).send("done");
    } else response.status(200).send("file not found");
  } catch (e) {
    response.status(200).send("Error delete file");
  }
});
router.get("/GetPieces", async (request, response) => {
  await GetPieces()
    .then((res) => {
      log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});
router.get("/GetClientPiecess", async (request, response) => {
  await GetClientPieces(request.query.ClientId)
    .then((res) => {
      log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});
router.post("/CreateClientPiece", async (request, response) => {
  let ClientId = request.body.ClientId;
  // let PieceId = request.body.PieceId;
  let ClientPieceId = request.body.ClientPieceId;
  let ClientPiecesDirectory = `./Pieces/${ClientId}`;

  if (!request.files || Object.keys(request.files).length === 0) return response.status(400).send("No files were uploaded.");

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
    await CreateClientPiece(newClientPiece).then(
      (res) => {
        log.Info(res);
        response.status(200).send(res);
      },
      (err) => {
        log.Info(err);
        response.status(500).send(err);
      }
    );
  });
});
router.get("/getPatrimoine/:id", async (req, res) => {
  const patrimoineId = req.params.id;
  const patrimoine = await Patrimoine.findById(patrimoineId);

  if (patrimoine) {
    // Inclure le chemin du document de statut dans la réponse
    res.json({
      ...patrimoine.toJSON(),
      StatusDocumentPath: patrimoine.StatusDocumentPath ? `/Pieces/${patrimoine.ClientId}/Status/${patrimoine.StatusDocumentPath}` : null,
    });
  } else {
    res.status(404).send("Patrimoine not found");
  }
});

router.post("/uploadStatusDocument", (req, res) => {
  const { ClientId, PatrimoineId } = req.body;

  // Dossier où stocker le document
  const clientDirectory = `./Pieces/${ClientId}/Status`;

  // Créez le répertoire s'il n'existe pas
  if (!fs.existsSync(clientDirectory)) {
    fs.mkdirSync(clientDirectory, { recursive: true });
  }

  if (!req.files || !req.files.file) {
    return res.status(400).send("Aucun fichier n'a été téléchargé.");
  }

  const file = req.files.file;
  const fileExtension = path.extname(file.name);

  if (fileExtension !== ".pdf") {
    return res.status(400).send("Seuls les fichiers PDF sont autorisés.");
  }

  const filePath = `${clientDirectory}/${PatrimoineId}.pdf`;

  // Supprimer l'ancien fichier s'il existe
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  file.mv(filePath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Retourne l'URL pour accéder au document
    res.send({ documentUrl: `/Pieces/${ClientId}/Status/${PatrimoineId}.pdf` });
  });
});

// Route pour uploader une image de profil
router.post("/UploadProfileImage", (request, response) => {
  let ClientId = request.body.ClientId;
  let ClientPiecesDirectory = `./Pieces/${ClientId}`;

  if (!request.files || Object.keys(request.files).length === 0) {
    return response.status(400).send("No files were uploaded.");
  }

  let fileToUpload = request.files.file;
  let fileExtension = fileToUpload.name.split(".")[fileToUpload.name.split(".").length - 1];

  // Créer le répertoire pour les pièces du client s'il n'existe pas
  let exists = fs.existsSync(ClientPiecesDirectory);
  if (!exists) fs.mkdirSync(ClientPiecesDirectory);

  // Supprimer l'ancienne image de profil si elle existe (peut être .jpg, .png, etc.)
  const oldFiles = fs.readdirSync(ClientPiecesDirectory).filter((file) => {
    return file.startsWith("profile.") && file !== `profile.${fileExtension}`;
  });

  oldFiles.forEach((file) => {
    const filePath = path.join(ClientPiecesDirectory, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Supprime l'ancienne image
    }
  });

  let uploadPath = `${ClientPiecesDirectory}/profile.${fileExtension}`;

  // Utiliser la méthode mv() pour placer le fichier sur le serveur
  fileToUpload.mv(uploadPath, async function (err) {
    if (err) return response.status(500).send(err);

    // Retourner l'URL de la nouvelle image
    response.status(200).send({ imageUrl: `/Pieces/${ClientId}/profile.${fileExtension}` });
  });
});
// router.post("/UploadClientPieceFile", async (req, res) => {
//   try {
//     const { ClientPieceId, ClientId, Extension } = req.body;
//     console.log("ClientPieceId: ", ClientPieceId);
//     console.log("ClientId: ", ClientId);
//     console.log("Extension: ", Extension);

//     // Ensure the ClientPieceId and ClientId are provided
//     if (!ClientPieceId || !ClientId) {
//       return res.status(400).send("ClientPieceId and ClientId are required");
//     }

//     // Path to the directory where the pieces are stored
//     const pieceDirectory = path.join(__dirname, `../Pieces/${ClientId}/`);

//     // Ensure the directory exists
//     if (!fs.existsSync(pieceDirectory)) {
//       fs.mkdirSync(pieceDirectory, { recursive: true });
//     }

//     // If there's a file in the request, handle the file upload
//     if (req.files && req.files.file) {
//       const file = req.files.file;
//       const fileExtension = path.extname(file.name);
//       const filePath = path.join(pieceDirectory, `${ClientPieceId}${fileExtension}`);

//       // Save the file
//       file.mv(filePath, (err) => {
//         if (err) {
//           console.error("Error saving the file", err);
//           return res.status(500).send("Error saving the file");
//         }

//         res.json({ message: "File uploaded successfully" });
//       });
//     } else {
//       res.status(400).send("No file provided");
//     }
//   } catch (error) {
//     console.error("Error uploading client piece", error);
//     res.status(500).send("Error uploading client piece");
//   }
// });

router.post("/UploadClientPieceFile", async (req, res) => {
  try {
    const { ClientPieceId, ClientId } = req.body;
    console.log("ClientPieceId: ", ClientPieceId);
    console.log("ClientId: ", ClientId);

    // Ensure the ClientPieceId and ClientId are provided
    if (!ClientPieceId || !ClientId) {
      return res.status(400).json({ error: "ClientPieceId and ClientId are required" });
    }

    // Path to the directory where the pieces are stored
    const pieceDirectory = path.join(__dirname, `../Pieces/${ClientId}/`);

    // Ensure the directory exists
    if (!fs.existsSync(pieceDirectory)) {
      fs.mkdirSync(pieceDirectory, { recursive: true });
    }

    // If there's a file in the request, handle the file upload
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileExtension = path.extname(file.name);
      const filePath = path.join(pieceDirectory, `${ClientPieceId}${fileExtension}`);

      // Save the file
      file.mv(filePath, async (err) => {
        if (err) {
          console.error("Error saving the file", err);
          return res.status(500).json({ error: "Error saving the file" });
        }

        // Update the client piece in the database after the file is saved
        try {
          const updateResult = await UpdateClientPiece(req.body);
          console.log("Updated successfully");
          log.Info("File uploaded and piece updated successfully ", updateResult);
          return res.status(200).json({ message: "File uploaded and piece updated successfully", updateResult });
        } catch (error) {
          log.Info(error);
          console.error("Error updating client piece, deleting the uploaded file", error);

          // Delete the file if the update fails
          try {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
            log.Info("Deleted file :", filePath);
          } catch (deleteError) {
            log.Info(deleteError);
            console.error("Error deleting the file after failed update", deleteError);
          }

          return res.status(500).json({ error: "Error updating client piece, file deleted" });
        }
      });
    } else {
      log.Info("No file provided");
      res.status(400).json({ error: "No file provided" });
    }
  } catch (error) {
    log.Info(error);
    console.error("Error uploading client piece", error);
    res.status(500).json({ error: "Error uploading client piece" });
  }
});

router.delete("/deleteProfileImage/:ClientId/profile.:ext", (req, res) => {
  const clientId = req.params.ClientId;
  const extension = req.params.ext;
  const filePath = `./Pieces/${clientId}/profile.${extension}`;

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted image: ${filePath}`);
      log.Info("Image de profil supprimée avec succès.");
      res.status(200).send("Image de profil supprimée avec succès.");
    } catch (error) {
      console.error(`Error deleting image: ${error}`);
      log.Info(`Error deleting image: ${error}`);
      res.status(500).send("Erreur lors de la suppression de l'image.");
    }
  } else {
    res.status(404).send("Aucune image de profil n'a été trouvée.");
  }
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
            .then((res) => {
              log.Info(res);
              response.status(200).send(res);
            })
            .catch((error) => {
              log.Info(error);
              response.status(400).send(error);
            });
        } else response.status(200).send("not found");
      }
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});

router.put("/UpdateClientPiece", async (request, response) => {
  await UpdateClientPiece(request.body)
    .then((res) => {
      log.Info(res);
      response.status(200).send(res);
    })
    .catch((error) => {
      log.Info(error);
      response.status(400).send(error);
    });
});

router.get("/DownloadClientPiece/:ClientPieceId", async (req, res) => {
  const { ClientPieceId } = req.params;

  try {
    const piece = await GetClientPiece(ClientPieceId); // Retrieve piece details
    if (!piece || piece.length === 0) {
      return res.status(404).send("Client piece not found");
    }

    const filePath = path.join(__dirname, `../Pieces/${piece[0].ClientId}/${piece[0].ClientPieceId}.${piece[0].Extension}`);
    if (fs.existsSync(filePath)) {
      res.download(filePath); // This triggers the file download
    } else {
      res.status(404).send("File not found");
    }
  } catch (error) {
    log.Info("Error downloading file: ", error);
    console.error("Error downloading file: ", error);
    res.status(500).send("Error downloading file");
  }
});

//#endregion ClientPiece

module.exports = router;
