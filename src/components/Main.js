import React from 'react';

class Main extends React.Component {
  state = {
    showSearchBar: false,
    showNewUserForm: false,
    showCheckInOut: false,
    shrink: false,
  };

  onFormSubmitUser = async () => {
    this.setState(
      {
        showSearchBar: !this.state.showSearchBar,
        showNewUserForm: false,
        shrink: true,
      },
      function () {
        this.props.onSubmit({
          showSearchBar: this.state.showSearchBar,
          showNewUserForm: this.state.showNewUserForm,
          showCheckInOut: this.state.showCheckInOut,
          shrink: this.state.shrink,
        });
      }
    );
  };
  onFormSubmitNewUser = async () => {
    this.setState(
      {
        showNewUserForm: !this.state.showNewUserForm,
        showSearchBar: false,
        showCheckInOut: false,
        shrink: true,
      },
      function () {
        this.props.onSubmit({
          showSearchBar: this.state.showSearchBar,
          showNewUserForm: this.state.showNewUserForm,
          showCheckInOut: this.state.showCheckInOut,
          shrink: this.state.shrink,
        });
      }
    );
  };

  render() {
    const shrink = this.state.shrink ? 'shrink' : '';
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
              <button
                className='btn btn-outline-success me-2 bg-dark'
                type='button'
                onClick={this.onFormSubmitUser}
              >
                <img
                  className={`mx-auto d-block user-img ${shrink}`}
                  src='user-member.png'
                  alt='user-member'
                />
                User
              </button>
              <button
                className='btn btn-outline-success me-2 bg-dark'
                type='button'
                onClick={this.onFormSubmitNewUser}
              >
                <img
                  className={`mx-auto d-block user-img ${shrink}`}
                  src='user-new-user.png'
                  alt='user-new-user'
                />
                New User
              </button>
            </form>
          </nav>
        </div>
      </div>
    );
  }
}

export default Main;
