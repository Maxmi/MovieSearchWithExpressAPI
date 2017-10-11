const express = require('express');
const rp = require('request-promise');
const cheerio = require("cheerio");
const app = express();
const port = process.env.PORT || 3000;


app.get('/api/imdb/search/:query', (req, res) => {
  const movie = req.params.query;
  
  let options = {
    url: `http://www.imdb.com/find?ref_=nv_sr_fn&q=${movie}&s=all`,
    json: true,
    transform: function(body) {
      return cheerio.load(body);
    }
  };

  rp(options)
    .then(($) => {
      const movieTitles = $(".findSection:contains('Titles')")
        .find('.result_text')
        .map((i, elm) => $(elm).text())
        .toArray();

      res.send(movieTitles);
      
    })
    .catch((err) => {
      console.error(err.message);
    });
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});

module.exports = {
  app
}