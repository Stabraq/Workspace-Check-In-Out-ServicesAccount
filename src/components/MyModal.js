import React from 'react';

class MyModal extends React.Component {
  openPage(event, href) {
    event.preventDefault();
    window.history.pushState({}, '', href);

    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  }

  render() {
    return (
      <div>
        <div
          className='modal fade'
          id='exampleModal'
          tabIndex='-1'
          aria-label='exampleModalLabel'
          aria-hidden='true'
        >
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                {/* <h5 className='modal-title' id='exampleModalLabel'>
                  Modal title
                </h5> */}
                <button
                  type='button'
                  className='btn-close'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                ></button>
              </div>
              <div className='modal-body text-center'>{this.props.body}</div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-stabraq'
                  data-bs-dismiss='modal'
                  onClick={(event) => {
                    switch (this.props.closeAction) {
                      case 'REFRESH':
                        return (window.location.pathname = '/');
                      case 'NEW-USER':
                        return this.openPage(event, '/main/new-user');
                      default:
                        return '';
                    }
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyModal;
