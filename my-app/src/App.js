import React, { Component } from 'react';
import logo from './logo1.png';
import './App.css';
import data from './laFourchette.json';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Top Chef Project - Web App Architectures </h1>
          <h4>  By Nissrine AIT ALI </h4>
          
          <h2 >Book a starred restaurant at the BEST PRICE and get exclusive offers thanks to LaFourchette.com</h2>
        </header>
        <div className="App-content">
        {
          data.map((restaurant) => {
            return <div className ="card">
            <br/>
            <img src = {restaurant.picture} alt = "logo" className ="logoRestaurant"/>
            <div className = "container"> 
            <h3> {restaurant.name} </h3>
            <h3> {restaurant.locality} </h3>
            <h4> {restaurant.stars} </h4>
            <h4> {restaurant.promo} </h4>
            <a className="Book" href={restaurant.link}>Book a table </a>
            </div>
            </div>
          })
        } </div>
        </div>
    );
  }
}

export default App;
