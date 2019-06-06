import React from 'react';
import { Form, Field } from 'react-final-form'
const axios = require('axios');


const validateRecord = (values) => {
    var errors = {};
    if (!values.title ) {
      errors.text= "Пустий відгук";
    }

    return errors;
}

class AddRespond extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: sessionStorage.getItem('user'),
      message: '', 
      image: '',
     };
    this.onSubmit = this.onSubmit.bind(this);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
  }
  onSubmit(values) {
    const url = 'http://localhost:8081/addRespond/'+this.props.match.params.id;
    const user = JSON.parse(sessionStorage.getItem('user'));
    if(user){
      const formData = new FormData();
    
      formData.append('text', values.title);
      
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
  componentDidMount () {
   

  }

  fileChangedHandler(event) {
    let file = event.target.files[0];
    this.setState({image: file});
  }

  render(){
    return(
    <>
    <div className="flex">
      <h1>Додати відгук</h1>
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
                          <label>Текст</label>
                          <input {...input} type="text" placeholder="опис товару" />
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

export default AddRespond;
