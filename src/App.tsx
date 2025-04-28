import React from 'react';
import Editor from './components/Editor';
import './global.css';
import Layout from './components/Layout/Layout';

function App() {
  console.log('process', process.env.NODE_ENV);

  return (
    <>
      <Layout>
        <Editor />
      </Layout>
    </>
  );
}

export default App;
