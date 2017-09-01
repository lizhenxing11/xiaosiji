import React, { Component } from 'react';
import './App.css';
import AppRouter from './Router/Router'
// import {Provider} from 'react-redux';
                        
class App extends Component {
  render() {
    return (
        <div className="App">
            <AppRouter/>
        </div>
    );
  }
}

export default App;
