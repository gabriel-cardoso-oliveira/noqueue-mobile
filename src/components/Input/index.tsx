import React, { forwardRef } from 'react';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { Feather as Icon } from '@expo/vector-icons';
import PropTypes from 'prop-types';

import { Container, TInput } from './styles';

const Input = forwardRef(({ style, icon, ...rest }: any, ref) => {
  return (
    <Container style={style}>
      {icon && <Icon name={icon} size={22} color="#3dd990" />}
      <TInput {...rest} ref={ref} />
    </Container>
  );
});

Input.propTypes = {
  icon: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Input.defaultProps = {
  icon: null,
  style: {},
};

export default Input;
