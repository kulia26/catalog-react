import React from 'react';
import { Link } from "react-router-dom";
import Respond from './Respond';

const axios = require('axios');

class Item extends React.Component {
    constructor(props) {
        super(props);
        let user = sessionStorage.getItem('user');
        user = user ? JSON.parse(user) : undefined;
        this.state = {
          item:{
          id: props.match.params.id,
          image:'',
          name:'',
          description:'',
          },
          user: user};
        this.getAdminButtons = this.getAdminButtons.bind(this);
        this.getAddRespond = this.getAddRespond.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        
    }

    componentDidMount () {
      
      axios.get('http://localhost:8081/getItem/' + this.state.item.id )
      .then(res => {
        this.setState({item: JSON.parse(res.body)});
      })
      .catch(err=>{
        
      });
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

    getAddRespond() {
        if(this.props.login){
            return(
                <>
                <div className="buttons">
                  <div className="button">
                  <Link to={"/addRespond/"+this.props.match.params.id}>
                   <button ><span>✍️</span>Додати відгук</button>
                   </Link>
                 </div>
                </div>
                </>
              )
        }
          
        
    }

    getResponds() {
      const responds = this.state.responds;
       if(responds && responds.length){
        return responds.map(res =>{
            return (<Respond text={res.text} user={res.addedBy}></Respond>)
        })
       }
    }

    render()
    {
        return (
           <>
            <section className="flex">
                <div className="col1 flex item">

                    <div className="image col2">
                        <img src={this.state.item.image} alt={this.state.item.name}></img>
                    </div>
                    <div className="text col5">
                        <h3>{this.state.item.name}</h3>

                        <i>{this.state.item.description}</i>
                        
                    </div>

                </div>
            </section>
            <div className="flex">
                <h1>
                    Відгуки покупців
                </h1>
            </div>
            <section className="flex">
               
      
            </section>
           </>

        );

    }
}

export default Item;
