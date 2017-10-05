import React from 'react';
import { Button, Form, Icon, Input, Layout, notification, Steps } from 'antd';
import { DateRangePicker } from 'react-dates';
import * as shallowCompare from 'react-addons-shallow-compare';
import moment from 'moment';
import axios from 'axios';
import './styles.css';

const { Header } = Layout;
const { TextArea } = Input;
const { Step } = Steps;
const { Item: FormItem } = Form;

class SendMessages extends React.Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
      hosts: [],
      status: 'process',
      step: 0,
      startDate: null,
      endDate: null,
      focusedInput: null,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    debugger;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ status: 'wait', step: 1 });
        axios
          .post('/csfilter/api/send', {
            values,
            startDate: moment(this.state.startDate).format('YYYY-MM-DD'),
            endDate: moment(this.state.endDate).format('YYYY-MM-DD'),
          })
          .then(() => {
            notification.success({
              message: 'Success',
              style: {
                width: 300,
                marginLeft: 335 - 300,
              },
            });
            this.setState({ status: 'finish', step: 2 });
          })
          .catch(() => {
            this.setState({ status: 'error' });
            notification.warn({
              message: 'Error - try again',
              style: {
                width: 300,
                marginLeft: 335 - 300,
              },
            });
          });
      } else {
        this.setState({ status: 'error', step: 1 });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Header className="header_title">Send messages</Header>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('numberOfSurfers', {
              rules: [
                { required: true, message: 'Please input number of Surfers!' },
              ],
            })(
              <Input
                prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                type="number"
                placeholder="Number of Surfers"
              />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('message', {
              rules: [
                { required: true, message: 'Please input message body!' },
              ],
            })(<TextArea rows={4} placeholder="Message body" />)}
          </FormItem>
          <FormItem>
            <DateRangePicker
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onDatesChange={({ startDate, endDate }) =>
                this.setState({ startDate, endDate })}
              focusedInput={this.state.focusedInput}
              onFocusChange={focusedInput => this.setState({ focusedInput })}
            />
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
        <Steps current={this.state.step} status={this.state.error}>
          <Step title="Start" description="Please fill all fields" />
          <Step title="In Process" description="Wait! We are send messages" />
          <Step title="Finished" description="Check result :)" />
        </Steps>
      </div>
    );
  }
}

export default Form.create()(SendMessages);
