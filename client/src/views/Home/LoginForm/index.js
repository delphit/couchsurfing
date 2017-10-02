import React from 'react';

import { Form, Icon, Input, Button, notification } from 'antd';
import axios from 'axios';
import './styles.css';

const { Item: FormItem } = Form;

class LoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        axios.post('/csfilter/api/login', {
          username: values.username,
          password: values.password
        })
          .then(function (response) {
            console.log(response);
            notification.success({
              message: 'Success',
              description: response.data.message,
              style: {
                width: 600,
                marginLeft: 335 - 600,
              },
            });
          })
          .catch(function (error) {
            notification.warn({
              message: 'Error - try again',
              description: error.data.message,
              style: {
                width: 600,
                marginLeft: 335 - 600,
              },
            });
          });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
            )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
            )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </FormItem>
      </Form>
    );
  }
};

export default Form.create()(LoginForm);
