const cheerio = require('cheerio');

function getCurrentWPVer(html) {
  const $ = cheerio.load(html)
  const downloadButton = $('p.download-meta > a > strong')
  const extracted = downloadButton.text().substr(-5)

  //get from another source
  //compare
  //get more chars, and check if not a number or dot
  return extracted
}


module.exports = {
  getCurrentWPVer
};
