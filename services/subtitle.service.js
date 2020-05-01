module.exports = () => {
  const OpenSubtitlesHandler = require("./handlers/opensubtitles.handler");

  const getSubtitlesByImdbId = async (imdbId) => {
    try {
      // Main Handler call
      const response = await OpenSubtitlesHandler.WrapCallOpenSubByImdbId(
        imdbId
      );
      return Promise.resolve(response);
    } catch (error) {
      // only one retry
      if (error.error && error.error.status === 401) {
        await OpenSubtitlesHandler.getAndSetToken();
        this.getSubtitlesByImdbId(imdbId);
      }
      return Promise.reject(error);
    }
  };

  return {
    getSubtitlesByImdbId,
  };
};
