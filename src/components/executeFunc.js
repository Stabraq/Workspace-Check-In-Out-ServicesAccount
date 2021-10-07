import { axiosAuth } from '@api/googleSheetsAPI';
const SHEET_ID = process.env.REACT_APP_SHEET_ID;

export const executeValuesUpdate = async (val) => {
  try {
    const googleSheetsAPI = await axiosAuth();

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

    console.log('Response executeValuesUpdate', response);
  } catch (err) {
    console.error('Execute error', err);
  }
};

export const executeBatchUpdateAddSheet = async (sheetDate) => {
  try {
    const googleSheetsAPI = await axiosAuth();
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
      'Response executeBatchUpdateAddSheet',
      response.data.replies[0].addSheet.properties.sheetId
    );
    return response.data.replies[0].addSheet.properties.sheetId;
  } catch (err) {
    console.error('Execute error', err.data.error.message);
    return false;
  }
};

export const executeBatchUpdateCutPaste = async (destSheetId) => {
  try {
    const googleSheetsAPI = await axiosAuth();
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
    console.log('Response executeBatchUpdateCutPaste', response);
  } catch (err) {
    console.error('Execute error', err);
  }
};

export const executeValuesAppendAddSheet = async () => {
  try {
    const googleSheetsAPI = await axiosAuth();

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

    console.log('Response executeValuesAppendAddSheet', response);
  } catch (err) {
    console.error('Execute error', err);
  }
};

export const executeValuesAppendNewUserData = async (userData) => {
  try {
    const googleSheetsAPI = await axiosAuth();

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

    console.log('Response executeValuesAppendNewUserData', response);
  } catch (err) {
    console.error('Execute error', err);
  }
};

export const executeValuesAppendCheckIn = async (checkInOut, valuesMatched) => {
  try {
    const googleSheetsAPI = await axiosAuth();

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
          [new Date().toLocaleTimeString('en-US')],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    console.log('Response executeValuesAppendCheckIn', response);
  } catch (err) {
    console.error('Execute error', err);
  }
};

export const executeValuesAppendCheckOut = async (
  checkInOut,
  rowNumber,
  membership
) => {
  try {
    const googleSheetsAPI = await axiosAuth();

    const range = `Data!G${rowNumber}`;
    const valueInputOption = 'USER_ENTERED';
    const response = await googleSheetsAPI.post(
      `${SHEET_ID}/values/${range}:append`,
      {
        majorDimension: 'COLUMNS',
        values: [
          [new Date().toLocaleTimeString('en-US')],
          [`=TEXT(G${rowNumber}-F${rowNumber},"h:mm")`],
          [
            `=IF(H${rowNumber}*24<1,1,IF(OR(AND(H${rowNumber}*24-INT(H${rowNumber}*24)<=0.1),AND(H${rowNumber}*24-INT(H${rowNumber}*24)>0.5,H${rowNumber}*24-INT(H${rowNumber}*24)<=0.59)),FLOOR(H${rowNumber},"00:30")*24,CEILING(H${rowNumber},"00:30")*24))`,
          ],
          membership.includes('Not Member')
            ? [`=IF(I${rowNumber}>=6,60,I${rowNumber}*10)`]
            : [''],
          [checkInOut],
        ],
      },
      { params: { valueInputOption: valueInputOption } }
    );

    console.log('Response executeValuesAppendCheckOut', response);
  } catch (err) {
    console.error('Execute error', err);
  }
};

export const getSheetValues = async (range) => {
  try {
    const googleSheetsAPI = await axiosAuth();

    const response = await googleSheetsAPI.get(`${SHEET_ID}/values/${range}`);

    console.log('Response getSheetValues', range, response.data.values[0]);
    return response.data.values[0];
  } catch (err) {
    console.error('Execute error', err);
  }
};
