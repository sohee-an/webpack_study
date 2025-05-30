import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Editor from './components/Editor';
import Layout from './components/Layout/Layout';
import Register from './pages/auth/register';
import Login from './pages/auth/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen ">
              <Editor />
            </div>
          }
        />
        <Route
          path="/editor"
          element={
            <Layout>
              <Editor />
            </Layout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
