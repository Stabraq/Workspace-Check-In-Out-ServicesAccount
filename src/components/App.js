import React from 'react';
import { axiosAuth } from '../api/googleSheetsAPI';
import {
  executeValuesUpdate,
  executeBatchUpdateAddSheet,
  executeBatchUpdateCutPaste,
  executeValuesAppendAddSheet,
  executeValuesAppendNewUserData,
  executeValuesAppendCheckIn,
  executeValuesAppendCheckOut,
  getSheetValues,
} from '../functions/executeFunc';
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
import { BrowserRouter, Route, Link } from 'react-router-dom';

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
    showCheckInOut: false,
    shrink: false,
    shrinkLogo: false,
    timeUp: false,
  };

  countDownTimerUp = async (value) => {
    this.setState({ timeUp: value });
  };
  // Function to Add new Sheet for new day
  getNewSheetId = async () => {
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

  doShrinkLogo = async () => {
    this.setState({
      shrinkLogo: true,
    });
  };

  onUserSubmit = async (mainData) => {
    this.setState({
      showCheckInOut: mainData.showCheckInOut,
      shrink: mainData.shrink,
    });
  };

  onSearchSubmit = async (term) => {
    // Show LoadingSpinner
    this.setState({ loading: true });

    // First Load
    if (this.state.firstLoad) {
      this.setState({ firstLoad: false });
    }

    // Check to Add new Sheet for new day
    const getSheetValuesSheetDateRange = 'Data!L1';
    const sheetDate = await getSheetValues(getSheetValuesSheetDateRange);
    this.setState({ sheetDate: sheetDate });

    const dateOne = this.state.sheetDate;
    const dateTwo = new Date().toLocaleDateString();
    const diff = await this.checkDateToAddSheet(dateOne, dateTwo);

    if (diff >= 1) {
      await this.getNewSheetId();
    }

    // Search for the user by mobile number
    await executeValuesUpdate(term);
    const getSheetValuesNumberExistsRange = 'Clients!I2';
    const numberExists = await getSheetValues(getSheetValuesNumberExistsRange);
    this.setState({ numberExists: numberExists });
    if (this.state.numberExists.includes('Exists')) {
      const getSheetValuesMatchedRange = 'Clients!J2:Q2';
      const valuesMatched = await getSheetValues(getSheetValuesMatchedRange);
      this.setState({ valuesMatched: valuesMatched });
    }

    // Hide LoadingSpinner
    this.setState({ loading: false });

    // Toggle showCheckInOut
    this.state.numberExists.includes('') ||
    this.state.numberExists.includes('Not Exists')
      ? this.setState({
          showCheckInOut: false,
        })
      : this.setState({
          showCheckInOut: true,
        });

    // Show Modal
    this.setState({
      modalBody: (
        <div className='text-center'>
          {this.state.numberExists.includes('Exists') ? (
            <h1>
              {/[\u0600-\u06FF]/.test(this.state.valuesMatched[1])
                ? 'مرحبا'
                : 'Welcome Back'}
              <br />
              {this.state.valuesMatched[1]}
            </h1>
          ) : (
            <div className='text-center'>
              <p>{this.state.numberExists}</p>
            </div>
          )}
        </div>
      ),
      modalCloseAction: this.state.numberExists.includes('Not Exists')
        ? 'NEW-USER'
        : null,
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
      this.setState({ firstLoad: false });
    }

    await executeValuesAppendNewUserData(userData);
    this.setState({
      modalBody: (
        <div className='text-center'>
          <h1>Form Submitted</h1>
        </div>
      ),
    });
    let myModal = new Modal(document.getElementById('exampleModal'), {});
    myModal.show();
    await executeValuesUpdate(userData.mobile);
    const getSheetValuesMatchedRange = 'Clients!J2:Q2';
    const valuesMatched = await getSheetValues(getSheetValuesMatchedRange);
    this.setState({ valuesMatched: valuesMatched });
    this.setState({
      showCheckInOut: true,
    });
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
          modalCloseAction: 'REFRESH',
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
              {this.state.valuesMatched[3].includes('Not Member') === false &&
              this.state.valuesMatched[4].includes('/') ? (
                <div>
                  <h1>Expiry Date: {this.state.valuesMatched[4]}</h1>
                  <h1>
                    Remaining Days:
                    {this.state.valuesMatched[5].includes('-')
                      ? `Expired ${this.state.valuesMatched[5]}`
                      : ` ${this.state.valuesMatched[5]} `}
                    Days
                  </h1>
                </div>
              ) : (
                ''
              )}
            </div>
          ),
          modalCloseAction: 'REFRESH',
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
          modalCloseAction: 'REFRESH',
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
          modalCloseAction: 'REFRESH',
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
        const getSheetValuesDurationRange = `Data!H${this.state.valuesMatched[6]}:J${this.state.valuesMatched[6]}`;
        const resData = await getSheetValues(getSheetValuesDurationRange);
        this.setState({
          duration: resData[0],
          approxDuration: resData[1],
          cost: resData[2],
        });
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
          modalCloseAction: 'REFRESH',
        });
        let myModal = new Modal(document.getElementById('exampleModal'), {});
        myModal.show();
      }
    }
  };

  loadApiScript = async () => {
    this.setState({
      firstLoad: true,
    });

    await axiosAuth();
  };

  componentDidMount() {
    this.loadApiScript();
  }

  render() {
    const shrinkLogo =
      this.state.shrinkLogo || window.location.pathname !== '/'
        ? 'shrink-logo'
        : '';
    return (
      <BrowserRouter>
        <div className='ui container mt-3'>
          <Link to='/main'>
            <div className='text-center'>
              <button
                className='btn me-2 no-btn-focus'
                type='button'
                onClick={this.doShrinkLogo}
              >
                <img
                  className={`mx-auto d-block logo-img ${shrinkLogo}`}
                  src='/logo.png'
                  alt='Logo'
                />
              </button>
            </div>
          </Link>

          <Route
            path='/main'
            children={<Main onSubmit={this.onUserSubmit} />}
          ></Route>
          <Route
            path='/main/user'
            exact
            children={<SearchBar onSubmit={this.onSearchSubmit} />}
          ></Route>
          <Route
            path='/main/new-user'
            exact
            children={<NewUserForm onSubmit={this.onNewUserFormSubmit} />}
          ></Route>

          {this.state.loading ? <LoadingSpinner /> : null}

          {this.state.showCheckInOut ? (
            <CheckInOut onSubmit={this.onCheckInOutSubmit} />
          ) : null}

          <MyModal
            body={this.state.modalBody}
            closeAction={this.state.modalCloseAction}
          />
          <div className='container'>
            {this.state.firstLoad ? (
              <CountDownTimer
                hoursMinSecs={hoursMinSecs}
                onTimeUp={this.countDownTimerUp}
              />
            ) : null}
            {/* <button onClick={this.getNewSheetId}>AddSheet</button> */}
            {this.state.timeUp ? <div>Time Up</div> : null}
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
