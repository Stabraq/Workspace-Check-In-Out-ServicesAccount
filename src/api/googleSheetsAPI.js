import axios from 'axios';
// import { authenticate } from '../components/auth';

export const axiosAuth = async (ACCESS_TOKEN) => {
  try {
    // const doc = await authenticate();
    // const ACCESS_TOKEN = await doc.jwtClient.credentials.access_token;

    return axios.create({
      baseURL: `https://sheets.googleapis.com/v4/spreadsheets/`,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Execute error', err);
    return false;
  }
};
