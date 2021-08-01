import React from 'react';

class CheckInOut extends React.Component {
  state = { checkInOut: '' };

  onCheckInOut = (event) => {
    event.preventDefault();

    this.setState({ checkInOut: event.target.value }, function () {
      this.props.onSubmit(this.state.checkInOut);
    });
  };

  render() {
    return (
      <div className='ui segment'>
        <button
          className='ui primary button stabraq-bg'
          name='checkIn'
          value='Check In'
          onClick={this.onCheckInOut}
          type='submit'
        >
          Check In
        </button>
        <button
          className='ui primary button stabraq-bg'
          name='checkOut'
          value='Check Out'
          onClick={this.onCheckInOut}
          type='submit'
        >
          Check Out
        </button>
      </div>
    );
  }
}

export default CheckInOut;
