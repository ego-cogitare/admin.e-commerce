import React from 'react';
import Partials from './partials';
import Settings from '../../core/helpers/Settings';
import UI from '../../core/ui';
import '../../staticFiles/js/app';
import '../../staticFiles/css/AdminLTE.css';
import '../../staticFiles/css/custom-scrollbars.css';
import '../../staticFiles/css/skins/skin-blue.min.css';
import '../../staticFiles/css/Custom.css';
import { dispatch } from '../../core/helpers/EventEmitter';
import { get as bootstrap } from '../../actions/Settings';

export default class Layout extends React.Component {

  // Get bootstrap settings
  componentDidMount() {
    bootstrap(
      (config) => Settings.apply(config),
      (e) => {
        dispatch('notification:throw', {
          type: 'danger',
          title: 'Ошибка',
          message: e.responseJSON.error
        });
      }
    );
  }

  render() {
    return (
       <div className="hold-transition skin-blue sidebar-mini layout-boxed">
         <UI.Notifications limit="3" />
         <UI.Popup />
         <div className="wrapper">
          <Partials.Header />
          <Partials.LeftMenu />
          <Partials.Content children={this.props.children} />
          <Partials.Footer />
        </div>
      </div>
    );
  }
}
