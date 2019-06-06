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
        this.getAddRespond = this.getAddRespond.bind(this);
        
    }

    componentDidMount() {
      axios.get('http://localhost:8081/getItem/' + this.props.match.params.id )
      .then(res => {
        this.setState({item: res.data});
      })
      .catch((err, res)=>{
        this.setState({err:err.message})
      });
     }


    getAddRespond() {
        if(this.props.login){
            return(
                <>
                <div className="buttons">
                  <div className="button">
                  <Link to={"/addRespond/"+this.props.match.params.id}>
                   <button >Додати відгук</button>
                   </Link>
                 </div>
                </div>
                </>
              )
        }
    }

    getResponds() {
      if(this.state.item.responds){
        const responds = this.state.item.responds;
       if(responds && responds.length){
        return responds.map(res =>{
            return (<Respond text={res.text} image={res.image} name={res.name} ></Respond>)
        })
       }
      }
      
    }

  

    render()
    {
        return (
           <>
            <section className="flex">
                <div className="col1 flex item">

                    <div className="image col2">
                        <img src={this.state.item.image || ''} alt={this.state.item.name || ''}></img>
                    </div>
                    <div className="text col5">
                        <h3>{this.state.item.name || ''}</h3>

                        <i>{this.state.item.description || ''}</i>
                        
                    </div>
                    {this.getAddRespond()}

                </div>
            </section>
            <div className="flex">
                <h1>
                    Відгуки покупців
                </h1>
            </div>
            <section className="flex column">
               
            {this.getResponds()}
            </section>
           </>

        );

    }
}

export default Item;
