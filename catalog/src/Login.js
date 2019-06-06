import React from 'react';
import { Form, Field } from 'react-final-form'
import validator from 'validator';
const axios = require('axios');

const User = sessionStorage.getItem('user');
const validateRecord = (values) => {
    var errors = {};
    if (!values.email ) {
      errors.email = "Пуста адреса";
    }else{
      if (!validator.isEmail(values.email)){
        errors.email = 'Неправильна адреса' 
      }
    }
    if (!values.password || !validator.isAlphanumeric(values.password+'')) {
      errors.password = "Пароль може містити тільки A-z0-9";
    }
    return errors;
}

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: User,
      message: 'Введіть свої дані нижче', 
     };
    this.onSubmit = this.onSubmit.bind(this);
  }
  
  onSubmit(values) {
    axios.post('http://localhost:8081/login', values)
    .then((res) =>{
      this.setState({ message : res.data.message, user: res.data.user });
      sessionStorage.setItem('user', JSON.stringify(res.data.user));
      this.props.onLogIn();
    })
    .catch((err) =>{
       this.setState({ message :  err.message});
    });
  };
  render(){
    return(
    <>
    <div className="flex">
      <h1>Вхід </h1>
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
                    <Field name={`email`}>
                      {({ input, meta }) => (
                        <>
                          <label>Адреса</label>
                          <input {...input} type="text" placeholder="Ваша електронна пошта" />
                          <p className="error">{meta.error}</p>
                        </>
                      )}
                    </Field>
                    <Field name={`password`}>
                      {({ input, meta }) => (
                        <>
                          <label>Пароль</label>
                          <input {...input} type="password" placeholder="Введіть пароль" />
                          <p className="error">{meta.error}</p>
                        </>
                      )}
                    </Field>
                    <div className="buttons">
                      <button type="submit" disabled={props.submitting || props.pristine}>
                        Увійти
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

export default Login;
