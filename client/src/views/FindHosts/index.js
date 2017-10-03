import React from 'react';

import { Form, Icon, Input, Button, notification } from 'antd';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { subscribeToTimer } from '../../api/socket';
import './styles.css';
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3010');

const { Item: FormItem } = Form;

class FindHost extends React.Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
      users: 'Hey',
    };
    subscribeToTimer((users) => {
      this.setState({
        users,
      });
    });
  }
  componentDidMount() {
    socket.on("ooo", data => this.setState({ users: data }));
  }
  handleSubmit = e => {
    e.preventDefault();
    socket.emit('hey', 'hey');
  };
  render() {
    const { redirect } = this.state;
    const { getFieldDecorator } = this.props.form;

    if (redirect) {
      return <Redirect to="/find" />;
    }
    return (
      <div>
        <div />
        <Button
          type="primary"
          onClick={this.handleSubmit}
          className="login-form-button"
        >
          Get User profile
        </Button>

        {/*.map((e) => console.log(e))*/}
        {this.state.users
          ? <div>
              {this.state.users}
            </div>
          : <p>Loading...</p>}
      </div>
    );
  }
}

export default Form.create()(FindHost);
