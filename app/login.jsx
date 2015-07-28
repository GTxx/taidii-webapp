import React from 'react';
import $ from 'jquery';
import mui from 'material-ui';
import {RaisedButton, TextField} from 'material-ui';

let ThemeManager = new mui.Styles.ThemeManager();

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '', password: '', usernameErrorText: '', passwordErrorText: ''}
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  handleUsernameInput(evt){
    this.setState({username: evt.target.value})
  }

  handlePasswordInput(evt){
    this.setState({password: evt.target.value})
  }

  handleKeyDown(evt){

    let ENTER = 13;
    if (evt.keyCode == ENTER && this.state.username.length != 0 && this.state.password.length != 0) {
      this.handleLogin();
    }
  }

  handleLogin(){
    $.post(API_URL + '/jwt-token-auth/', {username: this.state.username, password: this.state.password})
      .done(function (data) {
        localStorage.setItem("token", data.token);
        window.location.href = '#/students'
      }.bind(this))
      .fail(function (xhr, status, err) {
        console.log(err)
      })
  }

  render(){
    return (
      <div className='col-md-4'>
        <TextField hintText='username' onChange={this.handleUsernameInput.bind(this)} errorText={this.state.usernameErrorText}/>
        <TextField hintText='password' onChange={this.handlePasswordInput.bind(this)} errorText={this.state.passwordErrorText} />
        <RaisedButton secondary={true} className="btn btn-primary pull-right"
                disabled={this.state.username.length == 0 || this.state.password.length == 0}
                onClick={this.handleLogin}>Login
        </RaisedButton>
      </div>
    )
  }

  componentDidMount(){
    $(document.body).on('keydown', this.handleKeyDown);
  }

  componentWillMount(){
    $(document.body).off('keydown', this.handleKeyDown);
  }
}

Login.childContextTypes = {muiTheme: React.PropTypes.object}
export {Login};