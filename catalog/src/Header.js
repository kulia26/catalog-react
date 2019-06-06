import React from 'react';
import { Link } from "react-router-dom";

class Header extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
      }

    getLinks = () =>{
        if(this.props.login === false){
            return(
                <>
                <div className="col1 center mb-hidden">
                    <Link to="/login">
                        Вхід
                    </Link>
                </div>
                <div className="col1 center mb-hidden">
                    <Link to="/register">
                        Реєстрація
                    </Link>
                </div>
                </>
            )
        }else{
            const divStyle = {
                backgroundImage: 'url(' + this.props.image + ')'
            }
            
            return(
                <>
                <div className="col1 center mb-hidden">
                <div className="user-image" style={divStyle} >
                    
                </div>
                    
                </div> 
                <div className="col1 center mb-hidden">
                    <button onClick={this.props.onLogOut}>
                        Вихід
                    </button>
                </div>
                 
                </>
            ) 
        }
    }
  render(){
      return (
        <header className="flex">
            <button className="mb-only mobile-menu mobile-menu-bars">
                <i className="fas fa-bars"></i>
            </button>
            <button className="mb-only mobile-menu mobile-menu-times" href="#">
                <i className="fas fa-times"></i>
            </button>
            {this.getLinks()}
            <div className="col3 center">
                <Link to="/index">
                    <h1 className="name">Catalog</h1>
                </Link>
            </div>
            <div className="col1 center mb-hidden"><i className="fas fa-mobile-alt"></i>8 800 555 35 35</div>
            <div className="col1 center mb-hidden">
                <form action="/action_page.php" id="form1">
                    <input type="text" name="fname"></input>
                    <button><i className="fas fa-search"></i></button>
                </form>
            </div>
        </header>
    );
}
}

export default Header;
