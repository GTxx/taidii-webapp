import request from 'superagent';
import React from 'react';
import {DropDownMenu, RaisedButton, Toolbar, ToolbarGroup, List, ListItem, Avatar, Paper, TextField, ToolbarSeparator}
  from 'material-ui';
import {API_URL} from './config.js';


class TeacherList extends React.Component {
  constructor(props){
    super(props)
    this.state = {data: [] }
  }
  componentDidMount(){
    let token = localStorage['token'];
    request.get(`${API_URL}/api/taidii_teacher/?page_size=100`)
      .set('content-type', 'application/json')
      .set('authorization', `jwt ${token}`)
      .end((err, res)=>{
        if(res.ok){
          this.setState({data: res.body.results})
        }else{
          console.log(`request fail ${res}`)
        }
      })
  }
  search(){
    let token = localStorage['token'];
    request.get(`${API_URL}/api/taidii_teacher/?page_size=100&`)
      .set('content-type', 'application/json')
      .set('authorization', `jwt ${token}`)
      .end((err, res)=>{
        if(res.ok){
          this.setState({data: res.body.results})
        }else{
          console.log(`request fail ${res}`)
        }
      })
  }
  render(){
    console.log(this.state.data)
    let staffList = this.state.data.map((teacher, index)=>{
      return (<ListItem leftAvatar={<Avatar src={teacher.avatar} />} primaryText={teacher.username} key={index} />)
    })
    let filterOptions = [
      {payload: '1', text: 'active'},
      {payload: '2', text: 'resign'}
    ]
    return (
      <Paper>
        <Toolbar>
          <ToolbarGroup key={0} float='left'>
            <DropDownMenu menuItems={filterOptions} />
            <TextField hintText='search' onEnterKeyDown={this.search.bind(this)} />
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarSeparator />
            <RaisedButton label='add teacher' primary={true} />
          </ToolbarGroup>
        </Toolbar>
        <List>
          {staffList}
        </List>
      </Paper>
    )
  }
}

export {TeacherList}