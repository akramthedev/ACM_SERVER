var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const { CreatePatrimoine, UpdatePatrimoine, DeletePatrimoine, GetPatrimoines } = require("../Infrastructure/PatrimoineRepository");

//#region Patrimoine
// router.get("/GetPatrimoines", async (request, response) => {
//   await GetPatrimoines(request.query.ClientId)
//     .then((res) => response.status(200).send(res))
//     .catch((error) => response.status(400).send(error));
// });

router.get("/GetPatrimoines", async (req, res) => {
  console.log(",jgvjhvssdjhvc;jdsh,vbdsj;hfvbj");
  const clientId = req.query.ClientId;
  const patrimoines = await GetPatrimoines(clientId);

  patrimoines.forEach((patrimoine) => {
    const statusDocumentDirectory = `./Pieces/${clientId}/Status/`;

    if (fs.existsSync(statusDocumentDirectory)) {
      const statusDocumentFile = fs.readdirSync(statusDocumentDirectory).find((file) => file.startsWith(patrimoine.PatrimoineId));
      if (statusDocumentFile) {
        patrimoine.StatusDocumentPath = `${process.env.SERVER_URL}/Pieces/${clientId}/Status/${statusDocumentFile}`;
      } else {
        patrimoine.StatusDocumentPath = null;
      }
    } else {
      patrimoine.StatusDocumentPath = null;
    }
  });

  res.status(200).send(patrimoines);
});

// router.post("/CreatePatrimoine", async (request, response) => {
//   console.log("request: ", request.body);
//   await CreatePatrimoine(request.body)
//     .then((res) => response.status(200).send(res))
//     .catch((error) => response.status(500).send(error));
// });
router.post("/CreatePatrimoine", async (request, response) => {
  try {
    const newPatrimoine = await CreatePatrimoine(request.body);

    if (request.files && request.files.file) {
      const file = request.files.file;
      const clientId = newPatrimoine.ClientId;
      const patrimoineId = newPatrimoine.PatrimoineId;

      const statusDocumentDirectory = path.join(__dirname, `../Pieces/${clientId}/Status/`);
      if (!fs.existsSync(statusDocumentDirectory)) {
        fs.mkdirSync(statusDocumentDirectory, { recursive: true });
      }

      const statusDocumentPath = path.join(statusDocumentDirectory, `${patrimoineId}.pdf`);
      file.mv(statusDocumentPath, (err) => {
        if (err) {
          console.error("Error saving the status document", err);
          return response.status(500).send("Error saving the status document");
        }

        // Save the relative path to the database
        newPatrimoine.StatusDocumentPath = `${patrimoineId}.pdf`;

        // Now update the database with this path
        UpdatePatrimoineStatusDocumentPath(newPatrimoine.PatrimoineId, newPatrimoine.StatusDocumentPath)
          .then(() => {
            // Send the updated response back to the client
            newPatrimoine.StatusDocumentPath = `${process.env.SERVER_URL}/Pieces/${clientId}/Status/${patrimoineId}.pdf`;
            response.status(200).send(newPatrimoine);
          })
          .catch((updateError) => {
            console.error("Error updating StatusDocumentPath in the database", updateError);
            response.status(500).send("Error updating StatusDocumentPath in the database");
          });
      });
    } else {
      response.status(200).send(newPatrimoine);
    }
  } catch (error) {
    console.error("Error creating patrimoine", error);
    response.status(500).send("Error creating patrimoine");
  }
});

router.put("/UpdatePatrimoine", async (request, response) => {
  await UpdatePatrimoine(request.body)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
// router.delete("/DeletePatrimoine/:PatrimoineId", async (request, response) => {
//   await DeletePatrimoine(request.params.PatrimoineId)
//     .then((res) => response.status(200).send(res))
//     .catch((error) => response.status(400).send(error));
// });*
// router.delete("/DeletePatrimoine", async (request, response) => {
//   try {
//     let patrimoineId = request.query.PatrimoineId;
//     let clientId = request.query.ClientId;
//     patrimoineId = patrimoineId != null ? patrimoineId.toLowerCase() : null;
//     // clientId = clientId != null ? clientId.toLowerCase() : null;
//     // Construct the document path directly using the PatrimoineId
//     const statusDocumentDirectory = path.join(__dirname, `../Pieces/${clientId}/`, "Status/");
//     const documentPath = path.join(statusDocumentDirectory, `${patrimoineId}.pdf`);

//     // Delete the document from the filesystem if it exists
//     if (fs.existsSync(documentPath)) {
//       fs.unlinkSync(documentPath); // Deletes the file
//       console.log(`Document ${documentPath} deleted successfully`);
//     } else {
//       console.log(`Document ${documentPath} does not exist`);
//     }

//     // Delete the Patrimoine from the database
//     const deleteResult = await DeletePatrimoine(patrimoineId);

//     if (deleteResult) {
//       response.status(200).send("Patrimoine and its document deleted successfully");
//     } else {
//       response.status(400).send("Error deleting patrimoine");
//     }
//   } catch (error) {
//     console.error("Error deleting patrimoine", error);
//     response.status(500).send("Error deleting patrimoine");
//   }
// });
router.delete("/DeletePatrimoine", async (request, response) => {
  try {
    let patrimoineId = request.query.PatrimoineId;
    let clientId = request.query.ClientId;
    // patrimoineId = patrimoineId != null ? patrimoineId.toLowerCase() : null;
    // clientId = clientId != null ? clientId.toLowerCase() : null;

    // Delete the Patrimoine from the database
    const deleteResult = await DeletePatrimoine(patrimoineId);

    if (deleteResult) {

      const statusDocumentDirectory = path.join(__dirname, `../Pieces/${clientId}/`, "Status/");
      const documentPath = path.join(statusDocumentDirectory, `${patrimoineId}.pdf`);

      // Delete the document from the filesystem if it exists
      if (fs.existsSync(documentPath)) {
        fs.unlinkSync(documentPath); // Deletes the file
        console.log(`Document ${documentPath} deleted successfully`);
      } else {
        console.log(`Document ${documentPath} does not exist`);
      }

      response.status(200).json({ message: "Patrimoine and its document deleted successfully" });
    } else {
      response.status(400).json({ error: "Error deleting patrimoine" });
    }
  } catch (error) {
    console.error("Error deleting patrimoine", error);
    response.status(500).json({ error: "Error deleting patrimoine" });
  }
});

//#endregion Patrimoine

module.exports = router;
