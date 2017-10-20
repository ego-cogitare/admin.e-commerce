import React from 'react';
import { subscribe } from '../helpers/EventEmitter';
import '../../staticFiles/css/Notification.css';

class Notification extends React.Component {

  getLayout(id) {
    switch (id) {
      case 1:
        return (
          <div class={"box box-solid notification box-" + this.props.type} ref="message">
            <div class="box-header with-border">
              <h3 class="box-title">{this.props.title}</h3>
              <div class="box-tools pull-right">
                <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
              </div>
            </div>
            <div class="box-body">
              {this.props.message}
            </div>
          </div>
        );
      break;

      case 2:
        return (
          <div class={"alert notification alert-dismissible alert-" + this.props.type} ref="message">
            <button type="button" class="close">×</button>
            <h4><i class={"icon fa fa-" + (this.props.type === 'danger' ? "ban" : this.props.type)}></i> {this.props.title}</h4>
            {this.props.message}
          </div>
        );
      break;
    }
  }

  kill(node) {
    node.fadeOut(1000, () => this.props.onDie(this));
  }

  componentDidMount() {
    let node = $(this.refs.message);

    // Handling force notification close
    node.find('.close').bind('click', () => this.kill(node));

    // Autohide notification
    setTimeout(() => this.kill(node), this.props.dieAfter || 3000);
  }

  render() {
    return this.getLayout(2);
  }
}

export default class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messagesPull: [] };
    this.messageId = 0;
  }

  static TYPE_ERROR = 'danger';
  static TYPE_WARNING = 'warning';
  static TYPE_SUCCESS = 'success';

  componentWillMount() {
    subscribe('notification:throw', this.addMessage.bind(this));
  }

  addMessage(payload) {
    if (typeof payload.map !== 'undefined') {
      payload = payload.map(el => {
        el.id = this.messageId++;
        return el;
      });
    }
    else {
      payload.id = this.messageId++;
    }
    let messagesPull = this.state.messagesPull.concat(payload)
      .slice(this.props.limit * -1);

    this.setState({ messagesPull });
  }

  messageDied(notification) {
    let messagesPull = this.state.messagesPull
      .filter(el => el.id !== notification.props.id);

    this.setState({ messagesPull });
  }

  render () {
    return (
      <div class="notification-container">
        {this.state.messagesPull.map((msg, key) => {
          return (
            <Notification
              {...msg}
              key={msg.id}
              dieAfter={3000}
              onDie={this.messageDied.bind(this)}
            />
          );
        })}
      </div>
    );
  }
}
