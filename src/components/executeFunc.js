import { axiosAuth } from '../api/googleSheetsAPI';
const SHEET_ID = process.env.REACT_APP_SHEET_ID;

export const executeValuesUpdate = async (val, access_token) => {
  try {
    const googleSheetsAPI = await axiosAuth(access_token);

    const range = 'Clients!H2';
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.put(
      `${SHEET_ID}/values/${range}`,
      {
        // majorDimension: 'COLUMNS',
        values: [[`'${val}`]],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    console.log('Response', response);
  } catch (err) {
    console.error('Execute error', err);
  }
};

// Make sure the client is loaded and sign-in is complete before calling this method.
export const executeBatchUpdateCutPaste = async (destSheetId, access_token) => {
  try {
    const googleSheetsAPI = await axiosAuth(access_token);
    const response = await googleSheetsAPI.post(`${SHEET_ID}:batchUpdate`, {
      requests: [
        {
          cutPaste: {
            source: {
              sheetId: 1187395242,
            },
            destination: {
              sheetId: destSheetId,
            },
            pasteType: 'PASTE_NORMAL',
          },
        },
      ],
    });
    console.log('Response', response);
  } catch (err) {
    console.error('Execute error', err);
  }
};

export const executeValuesAppendNewUserData = async (userData, access_token) => {
  try {
    const googleSheetsAPI = await axiosAuth(access_token);

    const range = 'Clients!A3';
    const valueInputOption = 'RAW';
    const response = await googleSheetsAPI.post(
      `${SHEET_ID}/values/${range}:append`,
      {
        majorDimension: 'COLUMNS',
        values: [
          // [new Date().toLocaleString()],
          [userData.mobile],
          [userData.userName],
          [userData.email],
          [userData.membership],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    console.log('Response', response);
  } catch (err) {
    console.error('Execute error', err);
  }
};

export const executeValuesAppendCheckIn = async (
  checkInOut,
  valuesMatched,
  access_token
) => {
  try {
    const googleSheetsAPI = await axiosAuth(access_token);

    const range = 'Data!A2';
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.post(
      `${SHEET_ID}/values/${range}:append`,
      {
        majorDimension: 'COLUMNS',
        values: [
          [valuesMatched[1]],
          [`'${valuesMatched[0]}`],
          [valuesMatched[2]],
          [valuesMatched[3]],
          [checkInOut],
          [new Date().toLocaleTimeString()],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    console.log('Response', response);
  } catch (err) {
    console.error('Execute error', err);
  }
};

export const executeValuesAppendCheckOut = async (
  checkInOut,
  rowNumber,
  membership,
  access_token
) => {
  try {
    const googleSheetsAPI = await axiosAuth(access_token);

    const range = `Data!G${rowNumber}`;
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.post(
      `${SHEET_ID}/values/${range}:append`,
      {
        majorDimension: 'COLUMNS',
        values: [
          [new Date().toLocaleTimeString()],
          [`=TEXT(G${rowNumber}-F${rowNumber},"h:mm")`],
          [
            `=IF(H${rowNumber}*24<1,1,IF(OR(AND(H${rowNumber}*24-INT(H${rowNumber}*24)<=0.1),AND(H${rowNumber}*24-INT(H${rowNumber}*24)>0.5,H${rowNumber}*24-INT(H${rowNumber}*24)<=0.59)),FLOOR(H${rowNumber},"00:30")*24,CEILING(H${rowNumber},"00:30")*24))`,
          ],
          membership.includes('Not Member') ? [`=I${rowNumber}*10`] : [''],
          [checkInOut],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    console.log('Response', response);
  } catch (err) {
    console.error('Execute error', err);
  }
};

export const executeBatchUpdateAddSheet = async (sheetDate, access_token) => {
  try {
    const googleSheetsAPI = await axiosAuth(access_token);
    const response = await googleSheetsAPI.post(`${SHEET_ID}:batchUpdate`, {
      requests: [
        {
          addSheet: {
            properties: {
              title: sheetDate,
              rightToLeft: true,
            },
          },
        },
      ],
    });

    console.log(
      'Response',
      response.data.replies[0].addSheet.properties.sheetId
    );
    return response.data.replies[0].addSheet.properties.sheetId;
  } catch (err) {
    console.error('Execute error', err.data.error.message);
    return false;
  }
};

export const executeValuesAppendAddSheet = async (access_token) => {
  try {
    const googleSheetsAPI = await axiosAuth(access_token);

    const range = 'Data!A1';
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.post(
      `${SHEET_ID}/values/${range}:append`,
      {
        majorDimension: 'COLUMNS',
        values: [
          ['Name'],
          ['Mobile No.'],
          ['E-Mail'],
          ['Membership'],
          ['Check In'],
          ['CheckIn Time'],
          ['CheckOut Time'],
          ['Duration'],
          ['Approx. Duration'],
          ['Cost'],
          ['Check Out'],
          [new Date().toLocaleDateString()],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    console.log('Response', response);
  } catch (err) {
    console.error('Execute error', err);
  }
};
