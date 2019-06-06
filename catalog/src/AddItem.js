import React from 'react';
import { Form, Field } from 'react-final-form'
const axios = require('axios');

const User = sessionStorage.getItem('user');
const validateRecord = (values) => {
    var errors = {};
    if (!values.title ) {
      errors.title = "Пуста адреса";
    }
    if (!values.description ) {
      errors.description = "Пустий опис";
    }
    if (values.category==='' ) {
      errors.category = "Оберіть категорію";
    }

    return errors;
}

class AddItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: User,
      message: 'Додайте новий товар', 
      image: '',
     };
    this.onSubmit = this.onSubmit.bind(this);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
  }
  
  getCategories(){
    const categories = {
      'laptops': 'Ноутбуки',
      'tablets': 'Планшети',
      'smartphones': 'Смартфони',
      'keyboards': 'Клавіатури',
      'mouses': 'Мишки',
      'headphones': 'Навушники',
      'players': 'Плеєри',
    };
    const tags = [];
    for (const key in categories ) {
      if (categories.hasOwnProperty(key)) {
        const category = categories[key];
        tags.push(<option key={key} value={key}>{category}</option>);
      }
    }   
    return tags;            
  }

  fileChangedHandler(event) {
    let file = event.target.files[0];
    this.setState({image: file});
  }

  onSubmit(values) {

    const url = 'http://localhost:8081/addItem';
    const user = JSON.parse(sessionStorage.getItem('user'));
    if(user){
      const formData = new FormData();
    
      formData.append('image', this.state.image);
      formData.append('name', values.title);
      formData.append('description', values.description);
      formData.append('category', values.category);
      
      const config = {
          headers: {
              'content-type': 'multipart/form-data',
              "Authorization" : 'Bearer ' + user.token,
          }
      }
      axios.post(url, formData,config)
      .then(res => this.setState({ message : res.data.message}))
      .catch(err => this.setState({ message :  err.message}));
    }else{
      window.alert('Ви не авторизовані !');
    }
    
  };
  render(){
    return(
    <>
    <div className="flex">
      <h1>Додати товар</h1>
    </div>
    <div className="flex">
      <h2>{this.state.message}</h2>
    </div>
      <section className="flex col5">
          <div>
            <Form
            onSubmit={this.onSubmit}
            validate={validateRecord}
            validateOnBlur={false}
            onChange={validateRecord}
            render={(props) => {
              return (
                <>
                  <form onSubmit={props.handleSubmit} className="flex column">
                    <Field name={`title`}>
                      {({ input, meta }) => (
                        <>
                          <label>Назва</label>
                          <input {...input} type="text" placeholder="назва товару" />
                          <p className="error">{meta.error}</p>
                        </>
                      )}
                    </Field>
                    <Field name={`description`}>
                      {({ input, meta }) => (
                        <>
                          <label>Опис</label>
                          <input {...input} type="text" placeholder="опис товару" />
                          <p className="error">{meta.error}</p>
                        </>
                      )}
                    </Field>
                    <label>Категорія</label>
                    <Field name="category" component="select">
                          <option />
                          {this.getCategories()}
                    </Field>
                    <Field name={`image`}>
                      {({ input, meta }) => (
                        <>
                            <label>Фотографія</label>
                            <input {...input} onChange={this.fileChangedHandler} type="file"/ >
                            <p className="error">{meta.error}</p>
                        </>
                      )}
                    </Field>
                    <div className="buttons">
                      <button type="submit" disabled={props.submitting || props.pristine}>
                        Додати
                      </button>
                    </div>
                  </form>
                </>
                )
            }}
          />
      </div>
    </section>
    </>
   )
}};

export default AddItem;
