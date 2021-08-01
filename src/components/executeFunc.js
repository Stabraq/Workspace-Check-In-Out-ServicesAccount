const SHEET_ID = process.env.REACT_APP_SHEET_ID;

export const executeValuesUpdate = (val) => {
  return window.gapi.client.sheets.spreadsheets.values
    .update({
      spreadsheetId: SHEET_ID,
      range: 'Clients!H2',
      valueInputOption: 'USER_ENTERED',
      resource: {
        // majorDimension: 'COLUMNS',
        values: [[`'${val}`]],
      },
    })
    .then(
      (response) => {
        // Handle the results here (response.result has the parsed body).
        console.log('Response', response);
      },
      (err) => {
        console.error('Execute error', err);
      }
    );
};

// Make sure the client is loaded and sign-in is complete before calling this method.
export const executeBatchUpdateCutPaste = (destSheetId) => {
  return window.gapi.client.sheets.spreadsheets
    .batchUpdate({
      spreadsheetId: SHEET_ID,
      alt: 'json',
      resource: {
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
      },
    })
    .then(
      (response) => {
        // Handle the results here (response.result has the parsed body).
        console.log('Response', response);
      },
      (err) => {
        console.error('Execute error', err);
      }
    );
};

export const executeValuesAppend = (userData) => {
  return window.gapi.client.sheets.spreadsheets.values
    .append({
      spreadsheetId: SHEET_ID,
      range: 'Clients!A3',
      valueInputOption: 'RAW',
      resource: {
        majorDimension: 'COLUMNS',
        values: [
          // [new Date().toLocaleString()],
          [userData.mobile],
          [userData.userName],
          [userData.email],
          [userData.membership],
        ],
      },
    })
    .then(
      (response) => {
        // Handle the results here (response.result has the parsed body).
        console.log('Response', response);
      },
      (err) => {
        console.error('Execute error', err);
      }
    );
};

export const executeValuesAppendCheckIn = (checkInOut, valuesMatched) => {
  return window.gapi.client.sheets.spreadsheets.values
    .append({
      spreadsheetId: SHEET_ID,
      range: 'Data!A2',
      valueInputOption: 'USER_ENTERED',
      resource: {
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
    })
    .then(
      (response) => {
        // Handle the results here (response.result has the parsed body).
        console.log('Response', response);
      },
      (err) => {
        console.error('Execute error', err);
      }
    );
};

export const executeValuesAppendCheckOut = (
  checkInOut,
  rowNumber,
  membership
) => {
  return window.gapi.client.sheets.spreadsheets.values
    .append({
      spreadsheetId: SHEET_ID,
      range: `Data!G${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
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
    })
    .then(
      (response) => {
        // Handle the results here (response.result has the parsed body).
        console.log('Response', response);
      },
      (err) => {
        console.error('Execute error', err);
      }
    );
};

export const executeBatchUpdateAddSheet = async (sheetDate) => {
  try {
    const response = await window.gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
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
      },
    });
    console.log(
      'Response',
      response.result.replies[0].addSheet.properties.sheetId
    );
    return response.result.replies[0].addSheet.properties.sheetId;
  } catch (err) {
    console.error('Execute error', err.result.error.message);
    return false;
  }
};

export const executeValuesAppendAddSheet = async () => {
  try {
    const response = await window.gapi.client.sheets.spreadsheets.values.append(
      {
        spreadsheetId: SHEET_ID,
        range: 'Data!A1',
        valueInputOption: 'USER_ENTERED',
        resource: {
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
      }
    );
    console.log('Response', response);
  } catch (err) {
    console.error('Execute error', err);
  }
};
