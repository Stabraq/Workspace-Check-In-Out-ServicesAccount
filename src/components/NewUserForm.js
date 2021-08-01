import React from 'react';
import {
  checkForMobNum,
  checkForEmail,
  checkForUserName,
  checkForMembership,
} from './validation';

class NewUserForm extends React.Component {
  state = {
    userName: '',
    mobile: '',
    email: '',
    membership: '',
    validate: { userName: null, mobile: null, email: null, membership: null },
  };

  onNewUserFormSubmit = async (event) => {
    event.preventDefault();

    const validMobile = await checkForMobNum(this.state.mobile);
    const validEmail = await checkForEmail(this.state.email);
    const validUserName = await checkForUserName(this.state.userName);
    const validMembership = await checkForMembership(this.state.membership);

    this.setState({
      validate: {
        mobile: validMobile,
        email: validEmail,
        userName: validUserName,
        membership: validMembership,
      },
    });

    if (this.state.validate.mobile === false) return;
    if (this.state.validate.email === false) return;
    if (this.state.validate.userName === false) return;
    if (this.state.validate.membership === false) return;

    this.props.onSubmit({
      userName: this.state.userName,
      mobile: this.state.mobile,
      email: this.state.email,
      membership: this.state.membership,
    });
  };

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  render() {
    return (
      <div className='ui segment'>
        <form className='ui form'>
          <div>
            {this.state.userName !== '' && this.state.userName.length > 3 ? (
              <h1>Hello {this.state.userName}</h1>
            ) : (
              ''
            )}
          </div>
          <div className='field'>
            <label>User Name</label>
            <input
              type='text'
              name='userName'
              placeholder='يفضل باللغة العربية'
              onChange={this.myChangeHandler}
            />
            {this.state.validate.userName === null ||
            this.state.validate.userName === true ? (
              ''
            ) : (
              <div className='alert alert-danger' role='alert'>
                Enter valid User Name
              </div>
            )}
            <label>Mobile Number</label>
            <input
              type='text'
              name='mobile'
              placeholder='01xxxxxxxxx'
              onChange={this.myChangeHandler}
              maxLength={11}
            />
            {this.state.validate.mobile === null ||
            this.state.validate.mobile === true ? (
              ''
            ) : (
              <div className='alert alert-danger' role='alert'>
                Enter valid mobile number
              </div>
            )}
            <label>E-Mail Address</label>
            <input
              type='text'
              name='email'
              placeholder='stabraq@stabraq.com'
              onChange={this.myChangeHandler}
            />
            {this.state.validate.email === null ||
            this.state.validate.email === true ? (
              ''
            ) : (
              <div className='alert alert-danger' role='alert'>
                Enter valid E-Mail Address
              </div>
            )}
            <label>
              Membership
              <select name='membership' onChange={this.myChangeHandler}>
                <option value=''>...Select...</option>
                <option value='Not Member'>Not Member</option>
                <option value='Green'>Green</option>
                <option value='Orange'>Orange</option>
                <option value='Business'>Business</option>
                <option value='Ten Days'>Ten Days</option>
                <option value='Hours'>Hours</option>
              </select>
            </label>
            {this.state.validate.membership === null ||
            this.state.validate.membership === true ? (
              ''
            ) : (
              <div className='alert alert-danger' role='alert'>
                Select Membership
              </div>
            )}

            <button
              className='ui primary button stabraq-bg'
              onClick={this.onNewUserFormSubmit}
              type='submit'
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default NewUserForm;
