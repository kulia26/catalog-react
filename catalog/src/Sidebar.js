import React from 'react';
import categories from './categories';
import { Link } from "react-router-dom";

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
      }
      getCategories(){

        const tags = [];
        for (const key in categories ) {
          if (categories.hasOwnProperty(key)) {
            tags.push(
                <li key={key}>
                    <Link key={key} to={"/index/"+key}>
                    <h3 key={key}>
                        {categories[key]}
                    </h3>
                    </Link>
                </li>
            );
          }
        }   
        return tags;            
      }

render()
  {return (
        <aside className="col1 ">
            <div>
                <h1 className="center">Каталог</h1>
                <div className="arrow mb-only">
                    <i className="fas fa-arrow-down"></i>
                </div>

            </div>

            <div className="catalog-list">
                <ul>
                   {this.getCategories()}
                </ul>
            </div>

            <div className="arrow-up">
                <i className="fas fa-arrow-up"></i>
            </div>
        </aside>

  );}
}

export default Sidebar;
