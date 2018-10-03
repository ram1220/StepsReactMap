import React from 'react';
import { render } from 'react-dom'
import Dashboard from './components/dashboard'

render(
  <Dashboard />,
  document.getElementById('app')
);

module.hot.accept();