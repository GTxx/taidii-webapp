import request from 'superagent';
import React from 'react';
import {RouteHandler} from 'react-router';
import {DropDownMenu, RaisedButton, Toolbar, ToolbarGroup, List, ListItem, ListDivider, Avatar, Paper, TextField, ToolbarSeparator,
  LinearProgress, CircularProgress, FontIcon}
  from 'material-ui';
import {Menu, MenuItem} from 'material-ui';
import {API_URL} from './config.js';
import lunr from 'lunr';

require('bootstrap/dist/css/bootstrap.css');

class TeacherList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {data: [], showData: [], requestDone: false}
    this.lunr = lunr(function () {
      console.log(this)
      this.field('username', {boost: 10});
      this.field('ic');
      this.field('address');
      this.field('mobile_number');
      this.field('home_number');
      this.ref('id')
    })
  }

  componentDidMount() {
    let token = localStorage['token'];
    request.get(`${API_URL}/api/taidii_teacher/?page_size=100`)
      .set('content-type', 'application/json')
      .set('authorization', `jwt ${token}`)
      .end((err, res)=> {
        if (res.ok) {
          this.setState({data: res.body.results, showData: res.body.results, requestDone: true})
          res.body.results.map((teacher, index) => {
            this.lunr.add(teacher);
          })
        } else {
          console.log(`request fail ${res}`)
        }
      })
  }

  serverSearch() {
    let token = localStorage['token'];
    request.get(`${API_URL}/api/taidii_teacher/?page_size=100&`)
      .set('content-type', 'application/json')
      .set('authorization', `jwt ${token}`)
      .end((err, res)=> {
        if (res.ok) {
          this.setState({data: res.body.results})
        } else {
          console.log(`request fail ${res}`)
        }
      })
  }

  localSearch(evt) {
    if (!evt.target.value) {
      this.setState({showData: this.state.data})
      return
    } else {
      let id_list = this.lunr.search(evt.target.value).map((ele) => {
        return parseInt(ele.ref);
      })
      let data = this.state.data.filter((teacher)=> {
        return id_list.indexOf(teacher.id) != -1;
      })
      this.setState({showData: data})
    }
  }

  render() {
    let staffList = this.state.showData.map((teacher, index)=> {
      return (<ListItem leftAvatar={<Avatar src={teacher.avatar} />} primaryText={teacher.username} key={index}/>)
    })
    let filterOptions = [
      {payload: '1', text: 'active'},
      {payload: '2', text: 'resign'}
    ]
    let list = {};
    if (this.state.requestDone) {
      list = (<List>{staffList}</List>);
    } else {
      list = (<CircularProgress size={2}/>)
    }
    return (
      <div className='col-xl-8'>
        <div className='col-xl-4'>
          <Paper>
            <Toolbar>
              <ToolbarGroup key={0} float='left'>
                <DropDownMenu menuItems={filterOptions}/>
                <TextField hintText='search name/ic/home number/mobile number' onChange={this.localSearch.bind(this)}/>
              </ToolbarGroup>
              <ToolbarGroup>
                <ToolbarSeparator />
                <RaisedButton label='add teacher' primary={true}/>
              </ToolbarGroup>
            </Toolbar>
            {list}
          </Paper>
        </div>
        <RouteHandler />
      </div>
    )
  }
}

class Teacher extends React.Component {
  constructor(props) {
    super(props)
    this.state = {teacher: {}}
  }

  render() {
    return (
      <div className='col-xl-8'>
        <Paper>
          <Paper> </Paper>
        </Paper>
      </div>
    )
  }
}

class TeacherProfile extends React.Component {
  constructor(props) {
    super(props)
    // TODO: requestDone is not a good solution to decide web page loding is done
    console.log(123123123)
    this.state = {teacher: {}, requestDone: true}
  }

  componentDidMount() {
    // TODO: refresh only happen in component mount, will cause error
    let token = localStorage['token'];
    console.log(this.props)
    console.log(this.props.params.id)
    request.get(`${API_URL}/api/taidii_teacher/${this.props.params.id}/`)
      .set('content-type', 'application/json')
      .set('authorization', `jwt ${token}`)
      .end((err, res)=> {
        if (res.ok) {
          this.setState({teacher: res.body, requestDone: true})
        } else {
          console.log(`request fail ${res}`)
        }
      })
  }

  render() {
    console.log(this.state)
    return (
      <div className='col-xl-4'>
        <FontIcon className='material-icons' />
        <Paper>
          <List subheader="Contact">
            <ListItem primaryText={this.state.teacher.email || 'N.A'} disabled={true} leftIcon={<FontIcon className='material-icons' title='Email'>email</FontIcon>} />
            <ListItem primaryText={this.state.teacher.address || 'N.A'} disabled={true} leftIcon={<FontIcon className='material-icons' title='Address'>location_on</FontIcon>} />
            <ListItem primaryText={this.state.teacher.postal_code || 'N.A'} disabled={true} leftIcon={<FontIcon className='material-icons' title='Postal Code'>map</FontIcon>} />
            <ListItem primaryText={this.state.teacher.mobile_number || 'N.A'} disabled={true} secondaryText='Mobile' leftIcon={<FontIcon className='material-icons' title='Mobile Number'>smartphone</FontIcon>} />
            <ListItem primaryText={this.state.teacher.home_number || 'N.A'} disabled={true} secondaryText='Home Number' insetChildren={true} />
          </List>
        </Paper>
        <Paper>
          <Menu >
            <MenuItem primaryText="Bold" secondaryText="&#8984;B" />
            <MenuItem primaryText={'Gender'} secondaryText={this.state.teacher.gender || 'N.A'} disabled={true} />
            <MenuItem primaryText={'NRIC'} secondaryText={this.state.teacher.nric || 'N.A'} disabled={true} />
          </Menu>
        </Paper>
      </div>
    )
  }
}
export {TeacherList, Teacher, TeacherProfile}