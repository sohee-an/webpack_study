import React from 'react';
import Editor from './components/Editor';
import './global.css';
import Layout from './components/Layout/Layout';

function App() {
  console.log('process', process.env.NODE_ENV);

  return (
    <div>
      <Layout>
        <Editor />
      </Layout>
    </div>
  );
}

export default App;
