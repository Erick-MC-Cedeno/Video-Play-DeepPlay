import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../../_actions/user_actions";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Icon, Input, Button, Checkbox, Typography } from 'antd';
import { useDispatch } from "react-redux";

const { Title } = Typography;

function LoginPage(props) {
  const dispatch = useDispatch();
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

  const [formErrorMessage, setFormErrorMessage] = useState('')
  const [rememberMe, setRememberMe] = useState(rememberMeChecked)

  const handleRememberMe = () => {
    setRememberMe(!rememberMe)
  };

  const initialEmail = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : '';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' }}>
      <div style={{ backgroundColor: '#1E1E1E', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}>
        <Formik
          initialValues={{
            email: initialEmail,
            password: '',
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email('Email is invalid')
              .required('Email is required'),
            password: Yup.string()
              .min(6, 'Password must be at least 6 characters')
              .required('Password is required'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              let dataToSubmit = {
                email: values.email,
                password: values.password
              };

              dispatch(loginUser(dataToSubmit))
                .then(response => {
                  if (response.payload.loginSuccess) {
                    window.localStorage.setItem('userId', response.payload.userId);
                    if (rememberMe === true) {
                      window.localStorage.setItem('rememberMe', values.email); // Use email for rememberMe
                    } else {
                      localStorage.removeItem('rememberMe');
                    }
                    props.history.push("/");
                  } else {
                    setFormErrorMessage('Check out your Account or Password again')
                  }
                })
                .catch(err => {
                  setFormErrorMessage('Check out your Account or Password again')
                  setTimeout(() => {
                    setFormErrorMessage("")
                  }, 3000);
                });
              setSubmitting(false);
            }, 500);
          }}
        >
          {props => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            } = props;
            return (
              <div>
                <Title level={2} style={{ color: 'white', textAlign: 'center' }}>Log In</Title>
                <form onSubmit={handleSubmit} style={{ width: '300px', margin: '0 auto' }}>

                  <Form.Item required>
                    <Input
                      id="email"
                      prefix={<Icon type="user" style={{ color: 'rgba(255, 255, 255, 0.5)' }} />}
                      placeholder="Enter your email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ backgroundColor: '#282828', color: 'white', border: 'none', borderRadius: '4px' }}
                      className={errors.email && touched.email ? 'text-input error' : 'text-input'}
                    />
                    {errors.email && touched.email && (
                      <div className="input-feedback" style={{ color: '#ff4d4f' }}>{errors.email}</div>
                    )}
                  </Form.Item>

                  <Form.Item required>
                    <Input
                      id="password"
                      prefix={<Icon type="lock" style={{ color: 'rgba(255, 255, 255, 0.5)' }} />}
                      placeholder="Enter your password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ backgroundColor: '#282828', color: 'white', border: 'none', borderRadius: '4px' }}
                      className={errors.password && touched.password ? 'text-input error' : 'text-input'}
                    />
                    {errors.password && touched.password && (
                      <div className="input-feedback" style={{ color: '#ff4d4f' }}>{errors.password}</div>
                    )}
                  </Form.Item>

                  {formErrorMessage && (
                    <label>
                      <p style={{ color: '#ff4d4f', fontSize: '0.8rem', border: '1px solid #ff4d4f', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
                        {formErrorMessage}
                      </p>
                    </label>
                  )}

                  <Form.Item style={{ color: 'rgb(179,179,179)' }}>
                    <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe} style={{ color: 'rgb(179,179,179)' }}>Remember me</Checkbox>
                    <a className="login-form-forgot" href="/reset_user" style={{ float: 'right', color: 'rgb(179,179,179)' }}>
                      forgot password
                    </a>
                    <div style={{ marginTop: '1rem' }}>
                      <Button type="primary" htmlType="submit" style={{ minWidth: '100%', backgroundColor: '#1890ff', border: 'none', borderRadius: '4px' }} disabled={isSubmitting} onSubmit={handleSubmit}>
                        Log in
                      </Button>
                    </div>
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                      Or <a href="/register" style={{ color: 'rgb(179,179,179)' }}>register now!</a>
                    </div>
                  </Form.Item>
                </form>
              </div>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default withRouter(LoginPage);