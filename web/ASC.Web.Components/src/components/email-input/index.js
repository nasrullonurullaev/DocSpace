import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import isEqual from "lodash/isEqual";
import TextInput from '../text-input'
import { EmailSettings, parseAddress, checkEmailSettings, isEqualEmailSettings } from '../../utils/email';

const borderColor = {
  default: '#D0D5DA',
  isValid: '#2DA7DB',
  isNotValid: '#c30'
};

// eslint-disable-next-line no-unused-vars
const SimpleInput = ({ onValidateInput, isValidEmail, emailSettings, ...props }) => <TextInput {...props}></TextInput>;

SimpleInput.propTypes = {
  onValidateInput: PropTypes.func,
  isValidEmail: PropTypes.bool,
  emailSettings: PropTypes.oneOfType([PropTypes.instanceOf(EmailSettings), PropTypes.objectOf(PropTypes.bool)])
}

const StyledTextInput = styled(SimpleInput)`

  border-color: ${props => (props.isValidEmail ? borderColor.default : borderColor.isNotValid)};

    :hover {
      border-color: ${props => (props.isValidEmail ? borderColor.default : borderColor.isNotValid)};
    }

    :focus {
      border-color: ${props => (props.isValidEmail ? borderColor.isValid : borderColor.isNotValid)};
    }

`;

class EmailInput extends React.Component {
  constructor(props) {
    super(props);

    const { value, emailSettings } = this.props;
    const validatedSettings = checkEmailSettings(emailSettings);

    this.state = {
      isValidEmail: true,
      emailSettings: validatedSettings,
      value
    }
  }

  componentDidUpdate() {
    const { emailSettings } = this.props;
    if (isEqualEmailSettings(this.state.emailSettings, emailSettings)) return;

    const validatedSettings = checkEmailSettings(emailSettings);

    this.setState({ emailSettings: validatedSettings }, function () {
      this.checkEmail(this.state.value);
    });

  }

  checkEmail = (value) => {

    if (!value.length) {
      !this.state.isValidEmail && this.setState({ isValidEmail: true, value });
      return;
    }

    const emailObj = parseAddress(value, this.state.emailSettings);
    const isValidEmail = emailObj.isValid();

    this.props.onValidateInput
      && this.props.onValidateInput(isValidEmail);

    this.setState({ isValidEmail, value });
  }

  onChangeAction = (e) => {
    this.props.onChange && this.props.onChange(e);
    this.checkEmail(e.target.value);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  render() {
    //console.log('EmailInput render()');
    const {
      onValidateInput,
    } = this.props;

    const { isValidEmail, value } = this.state;

    return (
      <StyledTextInput
        isValidEmail={isValidEmail}
        onChange={this.onChangeAction}
        hasError={!isValidEmail}
        value={value}
        type='email'
        onValidateInput={onValidateInput}
        {...this.props}
      />
    );
  }
}

EmailInput.propTypes = {
  onValidateInput: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  emailSettings: PropTypes.oneOfType([PropTypes.instanceOf(EmailSettings), PropTypes.objectOf(PropTypes.bool)])
}

EmailInput.defaultProps = {
  id: '',
  name: '',
  autoComplete: 'email',
  maxLength: 255,
  value: '',
  isDisabled: false,
  isReadOnly: false,
  size: 'base',
  scale: false,
  withBorder: true,
  placeholder: '',
  className: '',

  settings: new EmailSettings()
}

export default EmailInput;