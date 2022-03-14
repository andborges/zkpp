import React from 'react';
import { Redirect } from 'react-router-dom';

import useToken from '../hooks/useToken';

export default function Logout() {
  const {
    logout
  } = useToken();

  logout();

  return (<Redirect to="/signin" />);
}
