import React, { Component } from 'react';
import '../css/App.css';
import {Redirect} from 'react-router-dom';
//import {browserRouter, Route} from 'react-router-dom'; //impoorting React Router to nav between pages

class Users extends Component {

  constructor(props){
    super(props);
    this.state = {
      back: false,
      SignOut: false,
      item: {UserId:null}
    }
    
    this.onBackClick = this.onBackClick.bind(this);
    this.onSignoutClick = this.onSignoutClick.bind(this);
    this.Userdetails = this.Userdetails.bind(this);
  }
  componentWillMount(){
    var data = this.props.location.items;
    fetch ('https://fypappservice.azurewebsites.net/GroupUsers',{
    //fetch ('http://localhost:62591//GroupUsers',{
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method:'POST',
      body: JSON.stringify(data),
    }).then(response => { return response.json() })
    .then(results => {
      if (results !== "false"){
        this.setState({
          UsersList: results,
        });
      }else {
        this.setState({
          error: "Could not find any users for this group"
        });
      }
    },
    (error)=>{
      this.setState({
        error: "There is something wrong with the server. Try again later"
      });
    }
    )
  }

  onBackClick(){
    this.setState({back:true});
  }
  onSignoutClick(){
    this.setState({SignOut:true});
  }

  Userdetails(event){
    var data = {};
    data={UserId:event.target.attributes.name.value};
    fetch ('https://fypappservice.azurewebsites.net/GroupUserDetail',{
    //fetch ('http://localhost:62591//GroupUserDetail',{
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method:'POST',
      body: JSON.stringify(data),
    }).then(response => { return response.json() })
    .then(results => {
      if (results !== "false"){
        this.setState({
          UsersPost: results,
        });
      }else {
        this.setState({
          error: "Could not find any users for this group"
        });
      }
    },
    (error)=>{
      this.setState({
        error: "There is something wrong with the server. Try again later"
      });
    }
    )
  }
  
  render() {
    let UserList = [], UserListchildren =[], UsersPost=[], UsersPostChildren=[];
    if(this.state.UsersList){
      for (let j = 0; j < this.state.UsersList.length; j++) {
        UserListchildren.push(<div className="userlist row col-md-12" key={j} >
        <p className="col-md-3" key={"user"+j} name={this.state.UsersList[j].UserId} onClick={this.Userdetails}>{this.state.UsersList[j].Name}</p>
        <p className="col-md-3" key={"NickName"+j}>{this.state.UsersList[j].NickName}</p>
        <p className="col-md-3" key={"Bio"+j}>{this.state.UsersList[j].Bio}</p>
        <p className="col-md-3" key={"Admin"+j}>{this.state.UsersList[j].Admin? "True": "False"}</p>
        </div>)
      }
      //Create the parent and add the children
      UserList.push(UserListchildren)
    }

    if(this.state.UsersPost){
      for (let j = 0; j < this.state.UsersPost.length; j++) {
        UsersPostChildren.push(<div className="row col-md-12" key={j} >
        <p className="col-md-8" key={"user"+j}>{this.state.UsersPost[j].Container}</p>
        <p className="col-md-4" key={"Admin"+j}>{this.state.UsersPost[j].SentTime}</p>
        </div>)
      }
      //Create the parent and add the children
      UsersPost.push(UsersPostChildren)
    }

    if (this.state.back === true){
    return (<Redirect to={{pathname:'/home', items: this.props.location.items}}/>)
    }else if (this.state.SignOut === true){
        return (<Redirect to='/'/>)
    }else{
    return (
      <div className="App">
        <div className="Navigation">
          <div className="row col-md-12">
            <div className="col-md-2 Back"><p className="NavTxt" onClick={this.onBackClick} ><i className="fas fa-chevron-left"></i>Back</p></div>
            <div className="col-md-8 PageName"><h1>Users</h1></div>
            <div className="col-md-2 SignOut"><p className="NavTxt" onClick={this.onSignoutClick}>SignOut</p></div>
          </div>
        </div>
        <div className="Users">
          <div className="row col-md-12">
            <h1 className="col-md-3" >UserName</h1>
            <h1 className="col-md-3" >NickName</h1>
            <h1 className="col-md-3" >Bio</h1>
            <h1 className="col-md-3" >Admin</h1>
          </div>
          {UserList}
          <div className="row col-md-12">
            <div className="row col-md-6"></div>
            <h1 className="row col-md-6">Activity</h1>
          </div>
          {UsersPost}
        </div>
      </div>
      );
    }
  }
}

export default Users;