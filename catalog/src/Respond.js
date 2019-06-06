import React from 'react';
import { Link } from "react-router-dom";
const axios = require('axios');


class Respond extends React.Component {
  
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
