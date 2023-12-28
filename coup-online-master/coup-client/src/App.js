// App.js

import React from 'react';
import ReactGA from 'react-ga';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Home from './components/Home';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import CadastroForm from './components/CadastroForm';
import LoginScreen from './components/LoginScreen';
import UserProfile from './components/UserProfile';
import PlayGame from './components/PlayGame';
import { UserProvider } from './components/UserContext';
import LanguageToggle from './components/LanguageToggle';
import './App.css'

const trackingId = process.env.REACT_APP_GOOGLE_TRACKING_ID || '';
ReactGA.initialize(trackingId);
ReactGA.pageview('/homepage');

function App() {
  return (
    <div className="App">
      <UserProvider>
      <LanguageToggle />
        <Router>
          <div>
            <Switch>
              <Route path="/create">
                <CreateGame style={{ marginTop: '1000px' }}/>
              </Route>
              <Route path="/join">
                <JoinGame style={{ marginTop: '1000px' }}/>
              </Route>
              <Route path="/cadastro">
                <CadastroForm />
              </Route>
              <Route path="/login">
                <LoginScreen />
              </Route>
              <Route path="/perfil">
                <UserProfile />
              </Route>
              <Route path="/play">
                <PlayGame />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
           
          </div>
          
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
