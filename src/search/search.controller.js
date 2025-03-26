const express = require('express');

const searchService = require('./search.service');

const router = express.Router({ mergeParams: true });

const searchGame = async (req, res) => {
  const { name, platform } = req.body;
  return searchService.searchGame(name, platform)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => res.status(400).send(err));
  // no middleware handlings errors yey otherwise I would have next(err) to handle it there
};

router.post('/api/games/search', searchGame);

module.exports = router;
