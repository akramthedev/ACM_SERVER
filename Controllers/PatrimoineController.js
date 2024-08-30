var express = require("express");
var router = express.Router();
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
router.delete("/DeletePatrimoine/:PatrimoineId", async (request, response) => {
  await DeletePatrimoine(request.params.PatrimoineId)
    .then((res) => response.status(200).send(res))
    .catch((error) => response.status(400).send(error));
});
//#endregion Patrimoine

module.exports = router;
