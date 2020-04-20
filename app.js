const Tesseract = require('tesseract.js');

const { createWorker } = Tesseract;
(async () => {
  const worker = createWorker({
    logger: m => console.log(m), // Add logger here
  });
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  console.log("analyzing...");
  const { data: { text } } = await worker.recognize("./input.tif", );
  console.log("done. here are the results:");
  console.log(text);
})();

