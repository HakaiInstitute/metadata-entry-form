const baseUrl = "https://api.datacite.org/dois/";
const { DATACITE_AUTH_HASH } = process.env;
const functions = require("firebase-functions");
const axios = require("axios");

exports.createDraftDoi = functions.https.onCall(async (record) => {
  const url = `${baseUrl}`;

  const response = await axios.post(url, record, {
    headers: {
      'Authorization': `Basic ${DATACITE_AUTH_HASH}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
});

exports.updateDraftDoi = functions.https.onCall(async (data) => {
  try{
    const url = `${baseUrl}${data.doi}/`;
    const response = await axios.put(url, data.data, {
      headers: {
        'Authorization': `Basic ${DATACITE_AUTH_HASH}`,
        'Content-Type': "application/json",
      },
    });
    return {
      status: response.status,
      message: 'Draft DOI updated successfully',
    };
  } catch (err) {
    // if the error is a 401, throw a HttpsError with the code 'unauthenticated'
    if (err.response && err.response.status === 401) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Error from DataCite API: Unauthorized. Please check your API credentials.'
      );
    }
    // if the error is a 404, throw a HttpsError with the code 'unauthenticated'
    if (err.response && err.response.status === 404) {
      throw new functions.https.HttpsError(
        'not-found',
        'from DataCite API: Not-found. The resource is not found e.g. it fetching a DOI/Repository/Member details.'
      );
    }
    // initialize a default error message
    let errMessage = 'An error occurred while updating the draft DOI.';

    // if there is an error response from DataCite, include the status and statusText from the API error
    // if the error doesn't have a response, include the error message
    if (err.response) {
      errMessage = `from DataCite API: ${err.response.status} - ${err.response.statusText}`;
    } else if (err.message) {
      errMessage = err.message;
    }

    // throw a default HttpsError with the code 'unknown' and the error message
    throw new functions.https.HttpsError('unknown',errMessage);
  }
});

exports.deleteDraftDoi = functions.https.onCall(async (draftDoi) => {
  const url = `${baseUrl}${draftDoi}/`;
  const response = await axios.delete(url, {
    headers: { 'Authorization': `Basic ${DATACITE_AUTH_HASH}` },
  });
  return response.status;
});
