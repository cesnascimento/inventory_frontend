import React from 'react';
import "antd/dist/antd.css"
import "./style.scss"
import Router from './Router';
import { StoreProvider } from './store';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  );
}

export default App;
