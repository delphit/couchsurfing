import React from 'react';
import { Form, Icon, Input, Button, notification, Layout, Steps } from 'antd';
import { DateRangePicker } from 'react-dates';
import * as shallowCompare from 'react-addons-shallow-compare';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import PlacesAutocomplete from 'react-places-autocomplete';
import 'react-dates/lib/css/_datepicker.css';
import './styles.css';

const { Header } = Layout;
const { Step } = Steps;
const { Item: FormItem } = Form;

class FindHost extends React.Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
      hosts: [],
      address: '',
      status: 'process',
      step: 0,
      startDate: null,
      endDate: null,
      focusedInput: null,
    };
    this.onChange = address => this.setState({ address });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ status: 'wait', step: 1 });
        axios
          .post('/csfilter/api/hosts', {
            values,
            address: this.state.address,
            startDate: moment(this.state.startDate).format('YYYY-MM-DD'),
            endDate: moment(this.state.endDate).format('YYYY-MM-DD'),
          })
          .then(response => {
            notification.success({
              message: 'Success',
              style: {
                width: 300,
                marginLeft: 335 - 300,
              },
            });
            this.setState({ hosts: response.data.message.results });
            this.setState({ status: 'finish', step: 2 });
          })
          .catch(error => {
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
    const { redirect } = this.state;
    const { getFieldDecorator } = this.props.form;
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
      placeholder: 'City',
    };
    return (
      <div>
        <Header className="header_title">Get hosts</Header>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            <PlacesAutocomplete inputProps={inputProps} />
          </FormItem>
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
            {getFieldDecorator('perPage', {
              rules: [
                { required: true, message: 'Please input max hosts count!' },
              ],
            })(
              <Input
                prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                type="number"
                placeholder="Count of hosts"
              />,
            )}
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
              Start
            </Button>
          </FormItem>
          {this.state.step === 2 &&
            this.state.status === 'finish' &&
            <FormItem>
              <Button
                type="primary"
                className="login-form-button"
              >
                Go to the next step<Icon type="right" />
              </Button>
            </FormItem>}
        </Form>
        <Steps current={this.state.step} status={this.state.error}>
          <Step title="Start" description="Please fill all fields" />
          <Step title="In Process" description="Wait! We are get hosts" />
          <Step title="Finished" description="Go to next page" />
        </Steps>
      </div>
    );
  }
}

export default Form.create()(FindHost);
