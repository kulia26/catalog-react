import React from 'react';
import { Link } from "react-router-dom";
const axios = require('axios');

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {item: this.props.el};
        this.deleteThisItem = this.deleteThisItem.bind(this);
        this.editThisItem = this.editThisItem.bind(this);
    }

    deleteThisItem() {
      const item = this.props.item;
      const url = 'http://localhost:8081/deleteItem/'+item._id;
      const user = JSON.parse(sessionStorage.getItem('user'));
      if(user){
        const config = {
            headers: {
                "Authorization" : 'Bearer ' + user.token,
            },  
        }
        axios.post(url,{item},config)
        .then(res => this.setState({ message : res.data.message}))
        .catch(err => this.setState({ message :  err.message}));
      }else{
        window.alert('Ви не авторизовані !');
      }
      this.props.onDelete(item);
     }

     editThisItem() {
      sessionStorage.setItem('editing', JSON.stringify(this.props.item));
      this.props.onEdit();
     }

    getAdminButtons() {
        if(this.props.isAdmin){
          return(
            <>
              <button onClick={this.deleteThisItem}>Видалити</button>
               <Link to="/edititem">
               <button onClick={this.editThisItem}>Редагувати</button>
              </Link>
              
            </>
          )
        }
    }
    render()
    {
        return (
            <article className="col1 flex column">
                <a href="/item.html">
                    <div className="image">
                        <img src={this.props.image} alt={this.props.title}></img>
                    </div>
                    <h3>{this.props.title}</h3>
                </a>
                <i>{this.props.description}</i>
                <br></br>
                
                {this.getAdminButtons()}
            </article>

    );
}
}

export default Card;
