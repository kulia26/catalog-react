import React from 'react';
import { Form, Field } from 'react-final-form'
import categories from './categories';
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

class EditItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: User,
      item: this.props.item,
     };
    this.onSubmit = this.onSubmit.bind(this);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
  }
  
  getCategories(){

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
      <h1>Редагувати</h1>
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
                          <input {...input} value={this.state.item.name} type="text" placeholder="назва товару" />
                          <p className="error">{meta.error}</p>
                        </>
                      )}
                    </Field>
                    <Field name={`description`}>
                      {({ input, meta }) => (
                        <>
                          <label>Опис</label>
                          <input {...input} value={this.state.item.description} type="text" placeholder="опис товару" />
                          <p className="error">{meta.error}</p>
                        </>
                      )}
                    </Field>
                    <label>Категорія</label>
                    <Field name="category" component="select">
                          {this.getCategories()}
                    </Field>
                    <Field name={`image`}>
                      {({ input, meta }) => (
                        <>
                            <label>Фотографія</label>
                            <input {...input}  onChange={this.fileChangedHandler} type="file"/ >
                            <p className="error">{meta.error}</p>
                        </>
                      )}
                    </Field>
                    <div className="buttons">
                      <button type="submit" disabled={props.submitting || props.pristine}>
                        Зберегти
                      </button>
                      <button type="button" disabled={props.submitting || props.pristine}>
                        Відмінити
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

export default EditItem;
