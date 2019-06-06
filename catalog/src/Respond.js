import React from 'react';
import { Link } from "react-router-dom";
const axios = require('axios');


class Respond extends React.Component {
    constructor(props) {
        super(props);
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
        
    

    render()
    {
        return(
            
                <div class="col1 flex advice">

                    <div class="image col2">
                        <img src={this.props.image} alt={this.props.name}></img>
                    </div>
                    <div class="text col5">
                        <h2>{this.props.name}</h2>

                        <p>
                            {this.props.text}
                        </p>
                    </div>

                </div>
        
        )
            

    }

}

export default Respond;
