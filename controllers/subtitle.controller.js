module.exports = () => {
  const subtitleService = require("../services/subtitle.service")();
  const Formatter = require("../formatter");

  const getSubtitlesByImdbId = async (req, res, next) => {
    try {
      const { imdbId } = req.query;
      const response = await subtitleService.getSubtitlesByImdbId(imdbId);
      res.status(200).send(Formatter.parseResponse(response, 200));
    } catch (error) {
      next(error);
    }
  };

  return {
    getSubtitlesByImdbId,
  };
};
