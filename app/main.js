import ReactRouter from 'react-router';
import {Route, RouteHandler} from 'react-router';
import React from 'react';
import {Login} from './login.jsx';
import {TeacherList} from './staff.jsx';
import $ from 'jquery';
import mui from 'material-ui';

let ThemeManager = new mui.Styles.ThemeManager();


const StudentList = React.createClass({
  componentDidMount: function(){
    $.ajax({
      url: API_URL+'/api/taidii_student/',
      headers: {'Content-Type': 'application/json', 'Authorization': 'jwt '+ this.state.token},
      statusCode: {
        401: ()=> {window.location.href='#/login'}
      }
    })
      .done(function(data){
        this.setState({
          studentList: data.results
        });
      }.bind(this))
      .fail(function(xhr, status, err){
        console.error(err)
      })
  },
  getInitialState: function(){
    let token = localStorage.getItem('token');
    if(token){
      return {'token': token, studentList: [], currentPage: 1, count: 0}
    }else{
      window.location.href = '#/login'
    }
  },
  render: function(){
    let studentTable = this.state.studentList.map(function(student, idx){
      return (
        <tr>
          <th scope='row'>{idx}</th>
          <td><ReactRouter.Link to="student" params={{id: student.id}}>{student.fullname}</ ReactRouter.Link></td>
          <td>{student.ic}</td>
        </tr>
      )
    })
    return (
      <div className='table'>
        {studentTable}
      </div>
    )
  }
});

const Student = React.createClass({
  componentDidMount: function(){
    console.log(this.state);
    $.ajax({
      url: API_URL+'/api/taidii_student/'+this.state.id+'/',
      headers: {'Content-Type': 'application/json', 'Authorization': 'jwt '+ this.state.token},
      statusCode: {
        401: ()=> {window.location.href='#/login'}
      }
    })
      .done(function(data){
        this.setState({
          student: data
        });
      }.bind(this))
      .fail(function(xhr, status, err){
        console.error(err)
      })
  },
  getInitialState: function(){
    let token = localStorage.getItem('token');
    console.log(token);
    if(token){
      return {'token': token, student: {}, id: this.props.params.id}
    }else{
      window.location.href = '#/login'
    }
  },
  render: function(){
    return (
      <div>{this.state.student}</div>
    )
  }
})

const App = React.createClass({
  childContextTypes: {muiTheme: React.PropTypes.object},
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },
  render: function(){
    return (
      <div>
        <RouteHandler />
      </div>
    )
  }
});

const routers = (
  <Route handler={App}>
    <Route path='login' handler={Login} />
    <Route path='students' handler={StudentList} name='student_list' />
    <Route path='/student/:id' handler={Student} name='student' />
    <Route path='/staff' handler={TeacherList} name='staff_list' />
  </Route>
);

ReactRouter.run(routers, ReactRouter.HashLocation, (Root) => {
  React.render(<Root />, document.getElementById('content'));
});