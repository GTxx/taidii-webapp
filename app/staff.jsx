import request from 'superagent';
import React from 'react';
import {DropDownMenu, RaisedButton, Toolbar, ToolbarGroup, List, ListItem, Avatar, Paper, TextField, ToolbarSeparator,
  LinearProgress, CircularProgress, FontIcon}
  from 'material-ui';
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
        <div className='col-xl-4'>

        </div>
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
    return (
      <div className='col-xl-4'>
        <FontIcon className='material-icons' />
        <Paper>
          <List subheader="Contact">
            <ListItem primaryText='account name' disabled={true} secondaryText='wangbin'/>
            <ListItem primaryText='email' disabled={true} leftIcon={<FontIcon className='material-icons' />} />

          </List>
        </Paper>
      </div>
    )
  }
}
export {TeacherList, Teacher, TeacherProfile}