import React from 'react';
import Card from './Card';
import axios from 'axios';
class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {category: props.category, isAdmin: props.isAdmin};
    this.componentDidMount = this.componentDidMount.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.someItemAreRemoved = this.someItemAreRemoved.bind(this);
    this.onEdit= this.onEdit.bind(this);
    
}

componentDidMount() {
  axios.get('http://localhost:8081/getItems/' + this.props.category )
  .then(res => {
    this.setState({items: JSON.parse(res.data)});
  })
  .catch(err=>{
    window.alert(err);
  })
}

someItemAreRemoved(item){
  let items = this.state.items;
  this.setState({items: items.filter((el) => el !== item) });
}

onEdit(){
  this.props.onEdit();
}


renderItems(){
  let render = [];
  for (const key in this.state.items) {
    if(this.props.category){
      const el = this.state.items[key];
      if(this.props.category === el.category){
      render.push(<Card isAdmin={this.props.isAdmin} onEdit={this.onEdit} onDelete={this.someItemAreRemoved} item={el} key={el._id} image={el.image} title={el.name} description={el.description}/>)
      }
    }else{
      const el = this.state.items[key];
      render.push(<Card isAdmin={this.props.isAdmin} onEdit={this.onEdit} onDelete={this.someItemAreRemoved} item={el} key={el._id} image={el.image} title={el.name} description={el.description}/>)
    }
  }
  return render;
}

render()
  {return (
    <>
    <div className="flex">
      <h1>{this.props.title.slice(2,)}</h1>
    </div>
    <section className="flex">
    {this.renderItems()}
    </section>
    
    </>
  );}
}

export default Cards;
