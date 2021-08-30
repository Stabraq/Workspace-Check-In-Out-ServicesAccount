import React from 'react';
import { Link } from 'react-router-dom';

class Main extends React.Component {
  state = {
    showCheckInOut: false,
    shrink: false,
  };

  onFormSubmitUser = async () => {
    this.setState({ shrink: true }, this.callBackFunc);
  };
  onFormSubmitNewUser = async () => {
    this.setState({ showCheckInOut: false, shrink: true }, this.callBackFunc);
  };

  callBackFunc() {
    this.props.onSubmit({
      showCheckInOut: this.state.showCheckInOut,
      shrink: this.state.shrink,
    });
  }

  render() {
    const shrink =
      this.state.shrink || window.location.pathname !== '/main' ? 'shrink' : '';
    return (
      <div>
        {/* <img
          className='mx-auto d-block'
          src='logo.png'
          alt='Logo'
          width='100'
          height='100'
        /> */}
        <div className='row ui container mt-3'>
          <nav className='navbar navbar-light'>
            <form className='container-fluid justify-content-center'>
              <Link to='/main/user'>
                <button
                  className='btn btn-outline-success me-2 bg-dark'
                  type='button'
                  onClick={this.onFormSubmitUser}
                >
                  <img
                    className={`mx-auto d-block user-img ${shrink}`}
                    src='/user-member.png'
                    alt='user-member'
                  />
                  User
                </button>
              </Link>
              <Link to='/main/new-user'>
                <button
                  className='btn btn-outline-success me-2 bg-dark'
                  type='button'
                  onClick={this.onFormSubmitNewUser}
                >
                  <img
                    className={`mx-auto d-block user-img ${shrink}`}
                    src='/user-new-user.png'
                    alt='user-new-user'
                  />
                  New User
                </button>
              </Link>
            </form>
          </nav>
        </div>
      </div>
    );
  }
}

export default Main;
