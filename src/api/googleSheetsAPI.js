import axios from 'axios';
import { authenticate } from './auth';

export const axiosAuth = async () => {
  try {
    const getNewToken = async () => {
      const doc = await authenticate();
      const NEW_ACCESS_TOKEN = await doc.jwtClient.credentials.access_token;
      const new_expiry_date = await doc.jwtClient.credentials.expiry_date;
      // sessionStorage.clear();
      sessionStorage.setItem('token', NEW_ACCESS_TOKEN);
      sessionStorage.setItem('expiry_date', new_expiry_date);
      console.log('NEW TOKEN');
    };

    const ACCESS_TOKEN = sessionStorage.getItem('token');
    const expiry_date = sessionStorage.getItem('expiry_date');
    
    if (expiry_date < Date.now()) {
      await getNewToken();
    }

    // console.log(expiry_date - Date.now());
    // console.log(expiry_date);
    // console.log(Date.now());
    // console.log(Math.floor((expiry_date - Date.now()) / 1000));

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
