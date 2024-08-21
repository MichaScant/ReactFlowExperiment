import React from 'react';
import ReactDOM from 'react-dom/client';

import { ReactFlowProvider } from '@xyflow/react';
 
import App from './App';
 
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  </React.StrictMode>,
)
