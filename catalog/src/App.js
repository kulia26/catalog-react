import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Cards from './Cards';
import About from './About';
import Contacts from './Contacts';
import NoMatch from './NoMatch';
import Register from './Register';
import ServerError from './ServerError';
import Login from './Login';
import AddItem from './AddItem';
import EditItem from './EditItem';
import categories from './categories';

class App extends React.Component{
  constructor(props) {
    super(props);
    let user = sessionStorage.getItem('user');
    let editing = sessionStorage.getItem('editing');
    user = user ? user : {};
    editing = editing ? editing : {};
    this.state = {
      login: user ? true : false,
       image: user ? user.image : '', 
       isAdmin: user ? user.isAdmin : false,
       editing: editing ? editing : {},
    };
    this.logout  = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.edit = this.edit.bind(this);
  }

  logout(){
    sessionStorage.removeItem('user');
    this.setState({
      login: false,
      isAdmin:  false,
    });
  }

  login(){
    let user = JSON.parse(sessionStorage.getItem('user'));
    this.setState({
      login: sessionStorage.getItem('user') ? true : false,
      image: user.image,
      isAdmin: user ? user.isAdmin : false,
      });
  }

  edit(){
    this.setState({
      editing: JSON.parse(sessionStorage.getItem('editing')),
      });
  }


  renderRouterCategories(){
    let render = [];
    for (const key in categories) {
      render.push( <Route exact path={/index/+key} render={() => <Cards onEdit={this.edit} isAdmin={this.state.isAdmin} title={categories[key]} category={key} />}/>);
    }
    return render;
  }

  render(){
    return (
      <Router>
      <div className="App">
        <Header login={this.state.login} image={this.state.image} onLogOut={this.logout} />
        <Nav />
        <div className="flex  content">
              <Sidebar />
              <div className="col5 main">
              <ServerError>
                <Switch>
                  <Route exact path="/" render={() => <Cards  onEdit={this.edit} isAdmin={this.state.isAdmin} title="  Розпродаж" category={this.state.category} />}/>
                  <Route exact path="/index" render={() => <Cards onEdit={this.edit} isAdmin={this.state.isAdmin} title="  Розпродаж" />}/>
                  {this.renderRouterCategories()}
                  <Route path="/about" component={About} />
                  <Route path="/contacts" component={Contacts} />
                  <Route path="/register" component={Register} />
                  <Route path="/additem" component={AddItem} />
                  <Route path="/edititem" render={() => <EditItem item={this.state.editing}/>}/>
                  <Route exact path="/login" render={() => <Login onLogIn={this.login} />}/>
                  <Route component={NoMatch} />
                </Switch>
              </ServerError>  
              </div>
        </div>
        <Footer />
      </div>
      </Router>
    );
  }
}

export default App;
