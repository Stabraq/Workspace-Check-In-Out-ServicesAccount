import React from 'react';
import { checkForMobNum } from './validation';

class SearchBar extends React.Component {
  state = { term: '', validNumber: null };

  onFormSubmit = async (event) => {
    event.preventDefault();
    const validNumber = await checkForMobNum(this.state.term);
    this.setState({ validNumber: validNumber });

    if (this.state.validNumber === false) return;
    this.props.onSubmit(this.state.term);
  };

  render() {
    return (
      <div className='ui segment'>
        <form onSubmit={this.onFormSubmit} className='ui form'>
          <div className='field'>
            <label>Search By Mobile Number</label>
            <input
              type='text'
              name='mobile'
              value={this.state.term}
              onChange={(e) => this.setState({ term: e.target.value })}
              maxLength={11}
              placeholder='01xxxxxxxxx'
            />
            {this.state.validNumber === null ||
            this.state.validNumber === true ? (
              ''
            ) : (
              <div className='alert alert-danger' role='alert'>
                Enter valid mobile number
              </div>
            )}
            <div className='mt-3'>
              <button
                className='ui primary button stabraq-bg'
                onClick={this.onFormSubmit}
                type='submit'
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default SearchBar;
