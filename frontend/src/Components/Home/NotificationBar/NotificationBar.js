import React, {Component} from 'react';
import { connect } from 'react-redux';

import './NotificationBar.css';

class NotificationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      class: 'animated fadeInDownBig notificationBar',
      renderDiv: true
    }
  }

  notifDisappear = () => {
    setTimeout(()=>{
      this.setState({
        class: 'fadeOutUp animated notificationBar'
      });
    },5000);
    setTimeout(()=>{
      this.setState({
        renderDiv: false
     });
   },7000);
  }

  renderNotificationMessage = () => {
    if(this.props.user._id){
      if (this.state.renderDiv){
        return (
          <div className={this.state.class}><p>Welcome {this.props.user.username}!</p></div>
        )
      }
    }else{
      return;
    }
  }

  consoleLog = () => {
    console.log(this.state.class);
  }

  render() {
    return (
      <div>
        {this.renderNotificationMessage()}
        {this.notifDisappear()}
      </div>
    );
  }
}

// {this.props.user._id ?
//   <div className={this.state.class}><p>{this.renderNotificationMessage()}</p></div>
//   : <div></div> }
// {this.notifDisappear()}

NotificationBar.propTypes = {
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    notification: state.notification
    //clinic: state.clinic,
    //activeClinic: state.activeClinic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationBar);
