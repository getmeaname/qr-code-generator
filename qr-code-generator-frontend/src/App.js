import React from 'react';
import QRCodeGenerator from './QRCodeGenerator';
import './index.css';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <QRCodeGenerator />
    </div>
  );
}

export default App;
