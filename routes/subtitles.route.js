/**
 * Subtitles routes
 */
module.exports = () => {
  const express = require("express");
  const router = express.Router();

  const subtitleController = require("../controllers/subtitle.controller")();

  /**
   * Download subtitle for imdb id
   */
  router.route("/getSubtitles").get((req, res, next) => {
    subtitleController.getSubtitlesByImdbId(req, res, next);
  });

  return router;
};
