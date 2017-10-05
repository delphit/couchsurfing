import React from 'react';

import { Form, Icon, Input, Button, notification, Avatar } from 'antd';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import PlacesAutocomplete from 'react-places-autocomplete';
import './styles.css';

const { Item: FormItem } = Form;

class FindHost extends React.Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
      hosts: [],
      address: 'San Francisco, CA',
    };
    this.onChange = address => this.setState({ address });
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
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
      placeholder: 'City',
    };
    {console.log(this.state.hosts)}

    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <PlacesAutocomplete inputProps={inputProps} />
          <FormItem>
            {getFieldDecorator('minGuestsWelcome', {
              rules: [{ required: true, message: 'Please input min guests!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                type="number"
                placeholder="minGuestsWelcome"
              />,
            )}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Start
            </Button>
          </FormItem>
        </Form>

        {this.state.hosts.length
          ? <div>
              {this.state.hosts.map(e =>
                <div>
                  <Avatar size="large">
                    {e.avatarUrl}
                  </Avatar>
                  <b>
                    {e.publicName}
                  </b>
                </div>,
              )}
            </div>
          : <p>Loading Hosts...</p>}
      </div>
    );
  }
}

export default Form.create()(FindHost);
