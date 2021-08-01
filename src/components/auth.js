const API_KEY = process.env.REACT_APP_API_KEY;

export const authenticate = () => {
  return window.gapi.auth2
    .getAuthInstance()
    .signIn({
      scope: 'https://www.googleapis.com/auth/spreadsheets',
    })
    .then(
      () => {
        console.log('Sign-in successful');
      },
      (err) => {
        console.error('Error signing in', err);
      }
    );
};

export const loadClient = () => {
  window.gapi.client.setApiKey(API_KEY);
  return window.gapi.client
    .load('https://sheets.googleapis.com/$discovery/rest?version=v4')
    .then(
      () => {
        console.log('GAPI client loaded for API');
      },
      (err) => {
        console.error('Error loading GAPI client for API', err);
      }
    );
};

