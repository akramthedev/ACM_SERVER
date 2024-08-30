var express = require("express");
const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");
var router = express.Router();
const { CreateClientPiece, DeleteClientPiece, GetClientPiece } = require("../Infrastructure/ClientPieceRepository");
const { GetPieces } = require("../Infrastructure/PieceRepository");

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
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
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
        response.status(200).send(res);
      },
      (err) => {
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

// router.post("/UploadProfileImage", async (request, response) => {
//   let ClientId = request.body.ClientId;
//   let ClientPiecesDirectory = `./Pieces/${ClientId}`;

//   if (!request.files || Object.keys(request.files).length === 0) return response.status(400).send("No files were uploaded.");

//   let fileToUpload = request.files.file;
//   let fileExtension = fileToUpload.name.split(".")[fileToUpload.name.split(".").length - 1];

//   // create ClientPiecesDirectory if it doesn't exist
//   let exists = fs.existsSync(ClientPiecesDirectory);
//   if (!exists) fs.mkdirSync(ClientPiecesDirectory);

//   let uploadPath = `${ClientPiecesDirectory}/profile.${fileExtension}`;

//   // Use the mv() method to place the file somewhere on your server
//   fileToUpload.mv(uploadPath, async function (err) {
//     if (err) return response.status(500).send(err);

//     // Return success with the image URL
//     response.status(200).send({ imageUrl: `/Pieces/${ClientId}/profile.${fileExtension}` });
//   });
// });

// Route pour uploader une image de profil
router.post("/UploadProfileImage", async (request, response) => {
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

// router.delete("/deleteProfileImage/:ClientId", (req, res) => {
//   const clientId = req.params.ClientId;
//   const imageDirectory = `./Pieces/${clientId}`;
//   const extensions = ["jpg", "jpeg", "png"];

//   // Vérification et suppression des fichiers de profil avec les différentes extensions
//   let imageDeleted = false;
//   extensions.forEach((ext) => {
//     const filePath = `${imageDirectory}/profile.${ext}`;
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//       imageDeleted = true;
//       console.log(`Deleted image: ${filePath}`);
//     }
//   });

//   if (imageDeleted) {
//     res.status(200).send("Image de profil supprimée avec succès.");
//   } else {
//     res.status(404).send("Aucune image de profil n'a été trouvée.");
//   }
// });
router.delete("/deleteProfileImage/:ClientId/profile.:ext", (req, res) => {
  const clientId = req.params.ClientId;
  const extension = req.params.ext;
  const filePath = `./Pieces/${clientId}/profile.${extension}`;

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted image: ${filePath}`);
      res.status(200).send("Image de profil supprimée avec succès.");
    } catch (error) {
      console.error(`Error deleting image: ${error}`);
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
            .then((res) => response.status(200).send(res))
            .catch((error) => response.status(400).send(error));
        } else response.status(200).send("not found");
      }
    })
    .catch((error) => response.status(400).send(error));
});
//#endregion ClientPiece

module.exports = router;
