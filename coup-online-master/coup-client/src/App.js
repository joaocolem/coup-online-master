import React from 'react';
import logo from './logo.svg';
import CreateGame from './components/CreateGame';
import './App.css';
import ReactGA from 'react-ga';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import JoinGame from './components/JoinGame';
import Home from './components/Home';
import CadastroForm from './components/CadastroForm';
import LoginScreen from './components/LoginScreen';
import UserProfile from './components/UserProfile';
import PlayGame from './components/PlayGame';
import { UserProvider } from './components/UserContext';
import { useUser } from './components/UserContext';

const trackingId = process.env.REACT_APP_GOOGLE_TRACKING_ID || '';
ReactGA.initialize(trackingId);
ReactGA.pageview('/homepage');

function App() {


  return (
    <div className="App">
    <UserProvider>
      <Router>
        <div>
          <Switch>
            <Route path="/create">
              <CreateGame> </CreateGame>
            </Route>
            <Route path="/join">
              <JoinGame></JoinGame>
            </Route>
            <Route path="/cadastro">
              <CadastroForm></CadastroForm>
            </Route>
            <Route path="/login">
              <LoginScreen></LoginScreen>
            </Route>
            <Route path="/perfil">
              <UserProfile></UserProfile>
            </Route>
            <Route path="/play">
              <PlayGame></PlayGame>
            </Route>
            <Route path="/">
              <Home></Home>
            </Route>
          </Switch>
        </div>

      </Router>
      </UserProvider>
    </div>
  );
}


export default App;
