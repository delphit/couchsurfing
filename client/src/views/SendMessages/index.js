import React from 'react';
import { Form, Icon, Input, Button, notification, Layout} from 'antd';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const { Header } = Layout;
const { Item: FormItem } = Form;

class SendMessages extends React.Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
      hosts: [],
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios
          .post('/csfilter/api/hosts', {
            values,
            address: this.state.address,
          })
          .then(response => {
            notification.success({
              message: 'Success',
              style: {
                width: 300,
                marginLeft: 335 - 300,
              },
            });
            this.setState({ hosts: response.data.message });
          })
          .catch(error => {
            console.log('error', error);
            notification.warn({
              message: 'Error - try again',
              description: error.response.data.message,
              style: {
                width: 300,
                marginLeft: 335 - 300,
              },
            });
          });
      }
    });
  };

  render() {
    const { redirect } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Header className="header_title">Send messages</Header>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input message title!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                type="text"
                placeholder="Message title"
              />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('message', {
              rules: [
                { required: true, message: 'Please input message body!' },
              ],
            })(
              <Input
                prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                type="text"
                placeholder="Message body"
              />,
            )}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Start sending
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(SendMessages);
