const puppeteer = require("puppeteer");
const hb = require("handlebars");
const utils = require("util");
const path = require("path");
const config = require('../config.json');
const log = require("node-file-logger");
const fs = require("fs");

// https://handlebarsjs.com/examples/builtin-helper-each-block.html
// https://handlebarsjs.com/guide/builtin-helpers.html#unless

log.SetUserOptions(config.loggerOptions);
// const readFile = utils.promisify(fs.readFile);
// async function getTemplateHtml(template) {
//   try {
//     const templatePath = path.resolve(template);
//     console.log("templatePath: ", templatePath)
//     return await readFile(templatePath, "utf8");
//   } catch (err) {
//     return Promise.reject("Could not load html template");
//   }
// }

function getImageBase64(imagePath) {
  const image = fs.readFileSync(imagePath);
  return `data:image/png;base64,${image.toString("base64")}`;
}
async function getTemplateHtml(template, imagesToReplace) {
  try {
    const templatePath = path.resolve(template);
    let html = await fs.promises.readFile(templatePath, "utf8");
    try {
      // Intégrer les images en base64
      // const logoBase64 = getImageBase64(path.resolve(__dirname, "./templates/assets/LOGO-BGG.png"));
      // const logoBase64 = getImageBase64(path.resolve(__dirname, "../templates/assets/LOGO-BGG.png"));
      // html = html.replace(`<img src="../LOGO-BGG.png" alt="" style="height: 90px; width: 160px; opacity: 90%" />`, `<img src="${logoBase64}" alt="" style="height: 90px; width: 160px; opacity: 90%" />`);

      imagesToReplace.forEach((img) => {
        html = html.replace(img.old, img.new)
      });
    } catch (ex) {
      return Promise.reject("Could not load photo");
    }
    return html;
  } catch (err) {
    return Promise.reject("Could not load html template");
  }
}
async function generatePdf(template, data, options, imagesToReplace) {
  try {
    const res = await getTemplateHtml(template, imagesToReplace);
    const templateCompiled = hb.compile(res, { strict: true });
    const htmlTemplate = templateCompiled(data);
    const browser = await puppeteer.launch({
      headless: true, // or false if you want a visible browser
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    await page.pdf(options);
    await browser.close();
    return options.path;
  } catch (err) {
    log.Error("\n --------------------- \n\n error generatePdf");
    log.Error(err);
    throw err;
  }
}

module.exports = { generatePdf, getImageBase64 };
