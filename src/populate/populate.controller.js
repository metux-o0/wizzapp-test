const express = require('express');

const populateService = require('./populate.service');

const router = express.Router({ mergeParams: true });

const populateGames = async (req, res) => populateService.populate()
  .then((response) => res.send(response))
  .catch((err) => res.status(400).send(err));

router.get('/api/games/populate', populateGames);

module.exports = router;
