// Redis client (Async using bluebird)
const client = require("../../redis").getClient;
const logger = require("../../logger");
const hey = require("../../helpers/requestHandler")();
const API_CONSTANTS = require("../../config/api.constants");

class OpenSubtitlesHandler {
  async WrapCallOpenSubByImdbId(imdbId) {
    // call
    const authToken = await this.getOpenSubtitlesToken();

    const findMovieSub = await this.getOpenSubtitlesByImdbId({
      imdbId,
      authToken,
    });

    if (findMovieSub.length > 0) {
      const file = findMovieSub[0].attributes.files[0];
      const payload = {
        file_id: file.id,
        file_name: file.file_name.split(".")[0],
        sub_format: "srt",
        authToken,
      };
      const download = await this.downloadSubtitles(payload);
      return Promise.resolve(download);
    } else {
      return Promise.reject("Subtitle not found");
    }
  }

  async downloadSubtitles({ file_id, file_name, sub_format, authToken }) {
    try {
      const uri =
        API_CONSTANTS.OPEN_SUBTITLES.API_BASE_URL +
        API_CONSTANTS.OPEN_SUBTITLES.DOWNLOAD_SRT_URL;
      const payload = { file_id, file_name, sub_format };
      const headers = {
        Authorization: authToken,
      };
      const response = await hey.doReq(payload, uri, {}, headers, "POST");
      return Promise.resolve(response.body);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getAndSetToken() {
    let res = "";
    const uri =
      API_CONSTANTS.OPEN_SUBTITLES.API_BASE_URL +
      API_CONSTANTS.OPEN_SUBTITLES.AUTH_URL;
    const payload = {
      username: "dotzeus",
      password: "Mrdcode4$",
    };
    const response = await hey.doReq(payload, uri, {}, {}, "POST");
    const setToken = await client.set(
      "opensub_auth_token",
      response.body.token
    );
    console.log("token set === ", setToken);
    res = response.body.token;
    return res;
  }

  async getOpenSubtitlesToken() {
    try {
      let res = await client.get("opensub_auth_token");
      if (res === null) {
        res = this.getAndSetToken();
      }
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getOpenSubtitlesByImdbId({ imdbId, authToken }) {
    try {
      const uri =
        API_CONSTANTS.OPEN_SUBTITLES.API_BASE_URL +
        API_CONSTANTS.OPEN_SUBTITLES.FIND_MOVIE_URL +
        `?languages=en&imdbid=${imdbId}`;
      const headers = {
        Authorization: authToken,
      };
      const response = await hey.doReq({}, uri, {}, headers, "GET");
      return Promise.resolve(response.body.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = new OpenSubtitlesHandler();
