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
        axios
        .post(url, item, config)
        .then((res) => {
          this.setState({ message : res.data.message});
          this.props.onDelete(item);
        })
        .catch(err => this.setState({ message :  err.message}));
      }else{
        window.alert('Ви не авторизовані !');
      }
     }

     editThisItem() {
      sessionStorage.setItem('editing', JSON.stringify(this.props.item));
      this.props.onEdit();
     }

    getAdminButtons() {
        if(this.props.isAdmin){
          return(
            <>
            <div className="buttons">
              <div className="button">
              <button onClick={this.deleteThisItem}><span >🗑️</span>Видалити</button>
              </div>
              <div className="button">
              <Link to="/edititem">
               <button onClick={this.editThisItem}><span>✍️</span>Редагувати</button>
               </Link>
             </div>
            </div>
              
               
              
            </>
          )
        }
    }
    render()
    {
        return (
            <article className="col1 flex column">
                <Link to={"/index/"+this.props.item.category+"/"+this.props.item._id}>
                    <div className="image">
                        <img src={this.props.image} alt={this.props.title}></img>
                    </div>
                    <h3>{this.props.title}</h3>
                </Link>
                <i>{this.props.description}</i>
                <br></br>
                
                {this.getAdminButtons()}
            </article>

    );
}
}

export default Card;
