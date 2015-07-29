import React from 'react';
import $ from 'jquery';
import mui from 'material-ui';
import {RaisedButton, TextField} from 'material-ui';
import request from 'superagent';
import {API_URL} from './config.js';
//import {api_request} from './utils.js';

let ThemeManager = new mui.Styles.ThemeManager();

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      enable: false,
      usernameError: '',
      passwordError: ''
    },
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleUsernameInput(evt){
    this.setState({username: evt.target.value})
  }
  handlePasswordInput(evt){
    this.setState({password: evt.target.value})
  }

  handleInput(evt){
    console.log(evt)
    console.log(React.findDOMNode(this.refs.username).value)
    let username = React.findDOMNode(this.refs.username).value.trim();
    let password = React.findDOMNode(this.refs.password).value.trim();
    if (username.length > 0 && password.length > 0){
      this.setState({enable: true})
    }else{
      this.setState({enable: false})
    }
  }

  handleKeyDown(evt){

    let ENTER = 13;
    if (evt.keyCode == ENTER && this.state.username.length != 0 && this.state.password.length != 0) {
      this.handleLogin();
    }
  }

  handleLogin(){
    request.post(`${API_URL}/jwt-token-auth/`)
      .send({username: this.state.username, password: this.state.password})
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        console.log(res)
        console.log(err)
        if(res.ok){
          localStorage.setItem("token", res.body['token'])
          window.location = '#/staff'
        }else{
          console.log('request fail')
        }
      })
  }

  render(){
    return (
      <div className='col-md-4'>
        <TextField hintText='username' ref='username' onChange={this.handleUsernameInput.bind(this)} errorText={this.state.usernameError} />
        <TextField hintText='password' ref='password' onChange={this.handlePasswordInput.bind(this)} errorText={this.state.passwordError} />
        <RaisedButton secondary={true} className="btn btn-primary pull-right"
                disabled={this.state.username.length == 0 || this.state.password.length == 0}
                onClick={this.handleLogin}>Login
        </RaisedButton>
      </div>
    )
  }

  componentDidMount(){
    $(document.body).on('keydown', this.handleKeyDown.bind(this));
  }

  componentWillMount(){
    $(document.body).off('keydown', this.handleKeyDown.bind(this));
  }
}

//Login.childContextTypes = {muiTheme: React.PropTypes.object}

export {Login};