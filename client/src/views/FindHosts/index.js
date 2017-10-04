import React from 'react';

import { Form, Icon, Input, Button, notification } from 'antd';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';


import { subscribeToTimer, getConversions } from '../../api/socket';
import './styles.css';
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3010');

const { Item: FormItem } = Form;

class FindHost extends React.Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
      users: '',
      time: '',
      address: 'San Francisco, CA'
    };
    subscribeToTimer((time) => {
      this.setState({
        time,
      });
    });

    this.onChange = (address) => this.setState({ address })
  }
  componentDidMount() {
    socket.on("getConversions", data => {
      console.log('data', data);
      this.setState({ users: data });
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        socket.emit('getHosts', values, this.state.address);
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


    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <PlacesAutocomplete inputProps={inputProps} />
          <FormItem>
            {getFieldDecorator('minGuestsWelcome', {
              rules: [{ required: true, message: 'Please input min guests!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="number" placeholder="minGuestsWelcome" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Start
            </Button>
          </FormItem>
        </Form>

        {/*.map((e) => console.log(e))*/}

        { this.state.users
          ? <div>
            {this.state.users}
          </div>
          : <p>Loading Hosts...</p>}
      </div>
    );
  }
}

export default Form.create()(FindHost);
