import React from "react";
import moment from "moment";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Typography } from 'antd';

const { Title } = Typography;

function RegisterPage(props) {
  const dispatch = useDispatch();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' }}>
      <div style={{ backgroundColor: '#1E1E1E', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', width: '350px' }}>
        <Formik
          initialValues={{
            email: '',
            lastName: '',
            name: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Email is invalid').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required')
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              let dataToSubmit = {
                email: values.email,
                password: values.password,
                name: values.name,
                lastname: values.lastName,
                image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
              };
              dispatch(registerUser(dataToSubmit)).then(response => {
                if (response.payload.success) {
                  props.history.push("/login");
                } else {
                  alert(response.payload.err.errmsg)
                }
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
                <Title level={2} style={{ color: 'white', textAlign: 'center' }}>Sign Up</Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Item required>
                    <Input
                      id="name"
                      placeholder="Enter your first name"
                      type="text"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ backgroundColor: '#282828', color: 'white', border: 'none', borderRadius: '4px' }}
                      className={errors.name && touched.name ? 'text-input error' : 'text-input'}
                    />
                    {errors.name && touched.name && <div className="input-feedback" style={{ color: '#ff4d4f' }}>{errors.name}</div>}
                  </Form.Item>

                  <Form.Item required>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      type="text"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ backgroundColor: '#282828', color: 'white', border: 'none', borderRadius: '4px' }}
                      className={errors.lastName && touched.lastName ? 'text-input error' : 'text-input'}
                    />
                    {errors.lastName && touched.lastName && <div className="input-feedback" style={{ color: '#ff4d4f' }}>{errors.lastName}</div>}
                  </Form.Item>

                  <Form.Item required hasFeedback validateStatus={errors.email && touched.email ? "error" : 'success'}>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ backgroundColor: '#282828', color: 'white', border: 'none', borderRadius: '4px' }}
                      className={errors.email && touched.email ? 'text-input error' : 'text-input'}
                    />
                    {errors.email && touched.email && <div className="input-feedback" style={{ color: '#ff4d4f' }}>{errors.email}</div>}
                  </Form.Item>

                  <Form.Item required hasFeedback validateStatus={errors.password && touched.password ? "error" : 'success'}>
                    <Input
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ backgroundColor: '#282828', color: 'white', border: 'none', borderRadius: '4px' }}
                      className={errors.password && touched.password ? 'text-input error' : 'text-input'}
                    />
                    {errors.password && touched.password && <div className="input-feedback" style={{ color: '#ff4d4f' }}>{errors.password}</div>}
                  </Form.Item>

                  <Form.Item required hasFeedback>
                    <Input
                      id="confirmPassword"
                      placeholder="Re-enter your password"
                      type="password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ backgroundColor: '#282828', color: 'white', border: 'none', borderRadius: '4px' }}
                      className={errors.confirmPassword && touched.confirmPassword ? 'text-input error' : 'text-input'}
                    />
                    {errors.confirmPassword && touched.confirmPassword && <div className="input-feedback" style={{ color: '#ff4d4f' }}>{errors.confirmPassword}</div>}
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={isSubmitting}
                      style={{ minWidth: '100%', backgroundColor: '#1890ff', border: 'none', borderRadius: '4px' }}>
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default RegisterPage;