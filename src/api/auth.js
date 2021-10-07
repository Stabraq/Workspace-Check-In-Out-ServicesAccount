import { GoogleSpreadsheet } from 'google-spreadsheet';

const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const doc = new GoogleSpreadsheet(SHEET_ID);

export const authenticate = async () => {
  await doc.useServiceAccountAuth({
    private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY.replace(
      /\\n/gm,
      '\n'
    ),
    client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
  });

  return doc;
};

export const docOnly = async () => {
  return doc;
};
