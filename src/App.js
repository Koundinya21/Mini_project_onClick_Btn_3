// import {useState} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import './App.css'

// import DetailsContext from './ReactContext'
import LoginForm from './components/LoginForm'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import Assessment from './components/Assessment'
import Results from './components/Results'
import NotFound from './components/NotFound'
import TimeUp from './components/TimeUp'

const App = () => (
  
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/assessment" component={Assessment} />
    <ProtectedRoute exact path="/results" component={Results} />
    <ProtectedRoute exact path="/time-up" component={TimeUp} />
    <Route path="/bad-path" component={NotFound} />
    <Redirect to="/bad-path" />
  </Switch>
)

export default App
