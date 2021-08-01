import React from 'react';
import { authenticate, loadClient } from './auth';
import {
  executeValuesUpdate,
  executeValuesAppend,
  executeValuesAppendCheckIn,
  executeValuesAppendCheckOut,
  executeBatchUpdateAddSheet,
  executeBatchUpdateCutPaste,
  executeValuesAppendAddSheet,
} from './executeFunc';
import Main from './Main';
import SearchBar from './SearchBar';
import NewUserForm from './NewUserForm';
import CountDownTimer from './CountDownTimer';
import CheckInOut from './CheckInOut';
import LoadingSpinner from './LoadingSpinner';
import MyModal from './MyModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../styles.css';
import { Modal } from 'bootstrap';

const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const hoursMinSecs = { hours: 0, minutes: 59, seconds: 0 };

class App extends React.Component {
  state = {
    numberExists: '',
    firstLoad: false,
    valuesMatched: [],
    checkInOut: '',
    duration: '',
    approxDuration: '',
    cost: '',
    newSheetId: 0,
    checkedIn: false,
    checkedOut: false,
    loading: false,
    modalBody: '',
    modalCloseAction: '',
    sheetDate: '',
    showNewUserForm: false,
    showSearchBar: false,
    showCheckInOut: false,
    shrink: false,
    showMain: false,
    shrinkLogo: false,
  };

  // Function to Add new Sheet for new day
  getNewSheetId = async () => {
    await authenticate();
    await loadClient();
    const newSheetId = await executeBatchUpdateAddSheet(
      this.state.sheetDate[0]
    );
    if (newSheetId === false) return;
    this.setState({
      newSheetId: newSheetId,
    });
    await executeBatchUpdateCutPaste(this.state.newSheetId);
    await executeValuesAppendAddSheet();
  };

  showMainPage = async () => {
    this.setState({
      showMain: true,
      shrinkLogo: true,
    });
  };

  onUserSubmit = async (mainData) => {
    this.setState({
      showNewUserForm: mainData.showNewUserForm,
      showSearchBar: mainData.showSearchBar,
      showCheckInOut: mainData.showCheckInOut,
      shrink: mainData.shrink,
    });
  };

  onSearchSubmit = async (term) => {
    // Reset State
    this.setState({
      numberExists: '',
      firstLoad: false,
      valuesMatched: [],
      checkInOut: '',
      duration: '',
      newSheetId: 0,
      checkedIn: false,
      checkedOut: false,
      modalBody: '',
    });

    // Show LoadingSpinner
    this.setState({ loading: true });

    // Authenticate
    if (this.state.firstLoad) {
      await authenticate();
      this.setState({ firstLoad: false });
    }
    await loadClient();

    // Check to Add new Sheet for new day
    await this.getSheetValuesSheetDate();

    const dateOne = this.state.sheetDate;
    const dateTwo = new Date().toLocaleDateString();
    const diff = await this.checkDateToAddSheet(dateOne, dateTwo);

    if (diff >= 1) {
      await this.getNewSheetId();
    }

    // Search for the user by mobile number
    await executeValuesUpdate(term);
    await this.getSheetValues();
    if (this.state.numberExists.includes('Exists')) {
      await this.getSheetValuesMatched();
    }

    // Hide LoadingSpinner
    this.setState({ loading: false });

    // Toggle between showNewUserForm & showSearchBar & showCheckInOut
    this.state.numberExists.includes('')
      ? this.setState({
          showNewUserForm: false,
          showSearchBar: false,
          showCheckInOut: false,
        })
      : this.state.numberExists.includes('Not Exists')
      ? this.setState({
          showNewUserForm: true,
          showSearchBar: false,
          showCheckInOut: false,
        })
      : this.setState({
          showNewUserForm: false,
          showCheckInOut: true,
        });

    // Show Modal
    this.setState({
      modalBody: (
        <div className='text-center'>
          {this.state.numberExists.includes('Exists') ? (
            <h1>Welcome Back {this.state.valuesMatched[1]}</h1>
          ) : (
            <div className='text-center'>
              <p>{this.state.numberExists}</p>
            </div>
          )}
        </div>
      ),
    });
    let myModal = new Modal(document.getElementById('exampleModal'), {});
    if (
      (this.state.numberExists.includes('Exists') &&
        this.state.valuesMatched[6].includes('Not Checked In')) ||
      this.state.numberExists.includes('Not Exists')
    ) {
      myModal.show();
    }
  };

  onNewUserFormSubmit = async (userData) => {
    console.log(userData);
    if (this.state.firstLoad) {
      await authenticate();
      this.setState({ firstLoad: false });
    }
    await loadClient();
    await executeValuesAppend(userData);
    this.setState({
      modalBody: (
        <div className='text-center'>
          <h1>Form Submitted</h1>
        </div>
      ),
    });
    let myModal = new Modal(document.getElementById('exampleModal'), {});
    myModal.show();
  };

  checkDateToAddSheet = async (dataDateOne, dataDateTwo) => {
    const dateOne = new Date(dataDateOne);
    const dateTwo = new Date(dataDateTwo);
    const diffTime = Math.abs(dateTwo - dateOne);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  onCheckInOutSubmit = async (checkInOut) => {
    if (checkInOut.includes('Check In')) {
      console.log('Welcome CheckIn');
      if (this.state.valuesMatched[6].includes('Not Checked In') === false) {
        this.setState({ checkedIn: true });
        this.setState({
          modalBody: (
            <div>
              <h1>You already Checked In</h1>
            </div>
          ),
          modalCloseAction: 'refresh',
        });
        let myModal = new Modal(document.getElementById('exampleModal'), {});
        myModal.show();
        return;
      } else {
        await executeValuesAppendCheckIn(checkInOut, this.state.valuesMatched);
        this.setState({
          modalBody: (
            <div>
              <h1>Checked In Successfully</h1>
              {this.state.valuesMatched[3].includes('Not Member') === false ? (
                <div>
                  <h1>Expiry Date: {this.state.valuesMatched[4]}</h1>
                  <h1>
                    Remaining Days:{' '}
                    {this.state.valuesMatched[5].includes('-')
                      ? `Expired ${this.state.valuesMatched[5]}`
                      : this.state.valuesMatched[5]}{' '}
                    Days
                  </h1>
                </div>
              ) : (
                ''
              )}
            </div>
          ),
          modalCloseAction: 'refresh',
        });
        let myModal = new Modal(document.getElementById('exampleModal'), {});
        myModal.show();
      }
    } else {
      console.log('Welcome CheckOut');
      if (this.state.valuesMatched[7].includes('Check Out')) {
        this.setState({ checkedOut: true });
        this.setState({
          modalBody: (
            <div>
              <h1>You already Checked Out</h1>
            </div>
          ),
          modalCloseAction: 'refresh',
        });
        let myModal = new Modal(document.getElementById('exampleModal'), {});
        myModal.show();
        return;
      } else if (this.state.valuesMatched[7].includes('Not Checked In')) {
        this.setState({
          modalBody: (
            <div>
              <h1>{this.state.valuesMatched[7]}</h1>
            </div>
          ),
          modalCloseAction: 'refresh',
        });
        let myModal = new Modal(document.getElementById('exampleModal'), {});
        myModal.show();
        return;
      } else {
        await executeValuesAppendCheckOut(
          checkInOut,
          this.state.valuesMatched[6],
          this.state.valuesMatched[3]
        );
        await this.getSheetValuesDuration();
        this.setState({
          modalBody: (
            <div>
              {this.state.duration.includes('') ? (
                <div>
                  <h1>Duration: {this.state.duration} Hr:Min</h1>
                  <h1>Approx. Duration: {this.state.approxDuration} Hours</h1>
                  {this.state.valuesMatched[3].includes('Not Member') ? (
                    <h1>Cost: {this.state.cost} EGP</h1>
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                ''
              )}
            </div>
          ),
          modalCloseAction: 'refresh',
        });
        let myModal = new Modal(document.getElementById('exampleModal'), {});
        myModal.show();
      }
    }
  };

  loadApiScript = async () => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    document.body.appendChild(script);

    script.onload = async () => {
      await window.gapi.load('client:auth2', async () => {
        await window.gapi.auth2.init({ client_id: CLIENT_ID });
      });
    };

    this.setState({ firstLoad: true });
  };

  componentDidMount() {
    this.loadApiScript();
  }

  getSheetValues = async () => {
    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Clients!I2',
      });
      // Handle the results here (response.result has the parsed body).
      console.log('Response', response.result.values[0]);
      this.setState({ numberExists: response.result.values[0] });
    } catch (err) {
      console.error('Execute error', err);
    }
  };

  getSheetValuesMatched = async () => {
    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Clients!J2:Q2',
      });
      // Handle the results here (response.result has the parsed body).
      console.log('Response', response.result.values[0]);
      this.setState({ valuesMatched: response.result.values[0] });
    } catch (err) {
      console.error('Execute error', err);
    }
  };

  getSheetValuesDuration = async () => {
    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `Data!H${this.state.valuesMatched[6]}:J${this.state.valuesMatched[6]}`,
      });
      // Handle the results here (response.result has the parsed body).
      const data = await response.result.values[0];
      console.log('Response', response.result.values[0]);
      this.setState({
        duration: data[0],
        approxDuration: data[1],
        cost: data[2],
      });
    } catch (err) {
      console.error('Execute error', err);
    }
  };

  getSheetValuesSheetDate = async () => {
    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Data!L1',
      });
      // Handle the results here (response.result has the parsed body).
      console.log('Response', response.result.values[0]);
      this.setState({ sheetDate: response.result.values[0] });
    } catch (err) {
      console.error('Execute error', err);
    }
  };

  render() {
    const shrinkLogo = this.state.shrinkLogo ? 'shrink-logo' : '';
    return (
      <div className='ui container mt-3'>
        <div className='text-center'>
          <button
            className='btn me-2 no-btn-focus'
            type='button'
            onClick={this.showMainPage}
          >
            <img
              className={`mx-auto d-block logo-img ${shrinkLogo}`}
              src='logo.png'
              alt='Logo'
            />
          </button>
        </div>

        {this.state.showMain ? <Main onSubmit={this.onUserSubmit} /> : ''}

        {this.state.showSearchBar ? (
          <SearchBar onSubmit={this.onSearchSubmit} />
        ) : (
          ''
        )}

        {this.state.showNewUserForm ? (
          <NewUserForm onSubmit={this.onNewUserFormSubmit} />
        ) : (
          ''
        )}

        {this.state.loading ? <LoadingSpinner /> : ''}

        {this.state.showCheckInOut ? (
          <CheckInOut onSubmit={this.onCheckInOutSubmit} />
        ) : (
          ''
        )}

        <MyModal
          body={this.state.modalBody}
          closeAction={this.state.modalCloseAction}
        />
        <div className='container'>
          {this.state.firstLoad === false ? (
            <CountDownTimer hoursMinSecs={hoursMinSecs} />
          ) : (
            ''
          )}
          {/* <button onClick={this.getNewSheetId}>AddSheet</button> */}
        </div>
      </div>
    );
  }
}

export default App;
