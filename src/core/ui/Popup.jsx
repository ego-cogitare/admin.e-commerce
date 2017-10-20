import React from 'react';
import { dispatch, subscribe } from '../helpers/EventEmitter';
import '../../staticFiles/css/Popup.css';

export default class Popup extends React.Component {

  constructor(props) {
    super(props);
    this.state = { popups: [] };
    subscribe('popup:show', (payload) => this.addPopup(payload));
    subscribe('popup:close', () => this.closePopup());
  }

  get initialState() {
    return {
      title: '',
      type: 'default',
      display: 'none',
      body: function() {
        return null;
      }
    };
  }

  addPopup(payload) {
    this.setState({
      popups: [
        ...this.state.popups,
        Object.assign({}, this.initialState, payload)
      ]
    });
  }

  closePopup(key = this.state.popups.length - 1) {
    // Trigger event on popup close
    dispatch('popup:closed', this.state.popups[key]);

    // Close animation
    $(this.refs['popup'.concat(key)]).fadeOut(500, () => {
      this.setState({ popups: this.state.popups.filter((popup, index) => index !== key) });
    });
  }

  render() {
    if (this.state.popups.length === 0) {
      return null;
    }
    return (
      <div class="popups-wrapper">
        {
          this.state.popups.map((popup, key) => {
            const style = popup.body.props ? popup.body.props.style : {};
            return (
              <div class={"popup-container modal modal-" + popup.type} style={{ display: 'block' }} ref={'popup'.concat(key)} key={key}>
                <div class="modal-dialog" style={style}>
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" onClick={this.closePopup.bind(this, key)}>
                        <span>×</span>
                      </button>
                      <h4 class="modal-title">{popup.title}</h4>
                    </div>
                    {popup.body}
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}
