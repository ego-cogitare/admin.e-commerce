import React from 'react';
import Partials from './partials';
import UI from '../../core/ui';
import '../../staticFiles/js/app';
import '../../staticFiles/css/AdminLTE.css';
import '../../staticFiles/css/custom-scrollbars.css';
import '../../staticFiles/css/skins/skin-blue.min.css';

export default class Layout extends React.Component {
  render() {
    return (
       <div className="hold-transition skin-blue sidebar-mini layout-boxed">
         <UI.Notifications limit="3" />
         <UI.Popup />
         <div className="wrapper">
          <Partials.Header />
          <Partials.LeftMenu />
          <Partials.Content />
          <Partials.Footer />
        </div>
      </div>
    );
  }
}
