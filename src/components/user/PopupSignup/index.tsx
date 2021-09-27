//Form component with the main fields for register in the platform
import CrossIcon from '../../../../public/assets/svg/icons/cross1.tsx'
import { useEffect } from 'react';
import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { authenticationService } from '../../services/authentication.service.ts';

class PopupSignup extends React.Component {
    constructor(props) {
        super(props);

        // redirect to home if already logged in
        if (authenticationService.currentUserValue) {
            this.props.history.push('/');
        }

    }

    render() {
        return (
            <div>
                <div className="alert alert-info">
                    Username: test<br />
                    Password: test
                </div>
                <h2>Login</h2>
                <Formik
                    initialValues={{
                        username: '',
                        password: ''
                    }}
                    validationSchema={Yup.object().shape({
                        username: Yup.string().required('Username is required'),
                        password: Yup.string().required('Password is required')
                    })}
                    onSubmit={({ username, password }, { setStatus, setSubmitting }) => {
                        setStatus();
                        authenticationService.login(username, password)
                            .then(
                                user => {
                                    const { from } = this.props.location.state || { from: { pathname: "/" } };
                                    this.props.history.push(from);
                                },
                                error => {
                                    setSubmitting(false);
                                    setStatus(error);
                                }
                            );
                    }}
                    render={({ errors, status, touched, isSubmitting }) => (
                        <Form>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                <ErrorMessage name="username" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Login</button>
                                {isSubmitting &&
                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                            </div>
                            {status &&
                                <div className={'alert alert-danger'}>{status}</div>
                            }
                        </Form>
                    )}
                />

            <div className="popup">
              <div className="popup__header">
                <header className="popup__header-content">
                  <div className="popup__header-left">
                    <button className="popup__header-button">
                      <div className="btn-circle__icon">
                        <CrossIcon />
                      </div>
                    </button>
                  </div>
                  <div className="popup__header-center">
                    <h1 className="popup__header-title">
                      Signup
                    </h1>
                  </div>
                  <div className="popup__header-right">
                    <button className="popup__header-button">
                      <div className="btn-circle__icon">
                        <CrossIcon />
                      </div>
                    </button>
                  </div>
                </header>
              </div>

              <div className="popup__content">

                <div className="popup__img">
                  <img src="https://dummyimage.com/550x200/#ccc/fff" alt="Register_img" className=""></img>
                </div>

                <form className="popup__section" onSubmit={this.handleSubmit}>

                  <div className="form-field">
                    <input type="text" id="email" className="form__input" value={this.state.value} onChange={this.handleChange} placeholder="Escribe tu mail para participar"></input>
                  </div>

                  <div className="form-field">
                    <input type="text"  id="password" className="form__input" value={this.state.value} onChange={this.handleChange} placeholder="Escribe una contraseña"></input>
                  </div>

                  <button className="btn-with-icon button-with-icon--offer" id="submit" type="submit" value="Submit" onSubmit={this.handleChange}>
                    <div className="btn-filter__icon">
                      <CrossIcon />
                    </div>
                    <div className="btn-with-icon__text">
                      ENTRAR
                    </div>
                  </button>

                </form>

                <div className="popup__options-v">

                  <button className="popup__options-btn">Tengo cuenta</button>

                </div>

              </div>

            </div>

          </div>

        )}
}

export default { PopupSignup };
