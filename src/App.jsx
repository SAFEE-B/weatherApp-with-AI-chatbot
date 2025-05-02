import React, { useState, useEffect, useMemo, useReducer } from 'react';
import './App.css';
import getAll from './Communication/network';
import Chatbot from "react-chatbot-kit";
import baseConfig from "./chatbot/config";
import MessageParser from "./chatbot/MessageParser";
import ActionProvider from "./chatbot/ActionProvider"
import 'react-chatbot-kit/build/main.css';
import Login from './components/login'
import Signup from './components/signup'
import {auth} from './firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth';
import { signOut } from 'firebase/auth';
// ShowWeatherComponent now ONLY displays weather
const ShowWeatherComponent = ({ data }) => {
  const dates = Object.keys(data);
  
  // Chatbot rendering removed from here

  return (
    <div>
      <h2>Weather by Day:</h2>
      
      {dates.length === 0 ? (
        <p>No daily forecast data available.</p>
      ) : (
        dates.map((date) => (
          <div key={date} className='dateData'>
            <h3>{date}</h3>
            {data[date].map((entry, index) => (
              <p key={`${date}-${entry.dt_txt}-${index} `} className='blockWithData'>
                {entry.dt_txt.split(' ')[1]}<br/>{entry.main.temp}°C<br/> {entry.weather[0].description}
              </p>
            ))}
          </div>
        ))
      )}
      {/* Chatbot removed */}
    </div>
  );
};


const App = () => {
  const[isChatBotReady,setIsChatBotReady]=useState(false)
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [weatherData, setWeatherData] = useState(null);
  const [weatherDataByDays, setWeatherDataByDays] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState(null)
  const[signupState,setSignupState]=useState(false)
  const[IsLoggedIn,setIsLoggedIn]=useState(false)
  const[isCheckingAuthState,setisCheckingAuthState]=useState(true)
  // Fetch location effect (no changes)



  useEffect(()=>{
    const unsubscribe=onAuthStateChanged(auth,(user)=>{
      if(user){
        setIsLoggedIn(true)
      }
      else{
        setIsLoggedIn(false)
      }
      setisCheckingAuthState(false)
    })
    

    return ()=>unsubscribe()
  }
  ,[])


  const ToggleSignUpLoginHandler=(event)=>{
    event.preventDefault()
    setSignupState(!signupState)
  }

  useEffect(() => {
    if(!IsLoggedIn){
      return}
    setLoading(true);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location obtained:", position.coords);
          setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError(`Error getting location: ${err.message}`);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  }, [IsLoggedIn]);
  // Fetch weather data effect (no changes)
  useEffect(() => {
    if(!IsLoggedIn){
      return
    }
    if (location.latitude !== null && location.longitude !== null) {
      console.log(`Fetching weather for: Lat ${location.latitude}, Lon ${location.longitude}`);
      setLoading(true);
      setError(null);
      getAll(location.latitude, location.longitude)
        .then(data => {
          console.log("Weather data received:", data);
          setWeatherData(data);
          setCityName(data.city.name)
          if(data && data.list){
            let tempArray={}
            data.list.forEach(dataElement=>{
              if(!tempArray[dataElement.dt_txt.split(' ')[0]]){
                tempArray[dataElement.dt_txt.split(' ')[0]]=[]
              }
              tempArray[dataElement.dt_txt.split(' ')[0]].push(dataElement)
            })
            setWeatherDataByDays(tempArray)
            
            // Make weather data globally available for the chatbot
            window.weatherDataForChatbot = tempArray;
            console.log("Set global weather data:", window.weatherDataForChatbot);
            setIsChatBotReady(true)
          }
        })
        .catch(fetchError => {
          console.error("Weather fetch error:", fetchError);
          setError('Failed to fetch weather data.');
          setWeatherData(null);
        })
        .finally(() => {
          setLoading(false);
        });

    }
  }, [location,IsLoggedIn]);

const handleLogout = () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out");
    })
    .catch((error) => {
      console.error("Sign out error:", error);
    });
    setisCheckingAuthState(false)
    setSignupState(false)
};

  return (
    (!isCheckingAuthState&&(
    <div>
      <h1>Weather App</h1>

      {IsLoggedIn ? (
        <>
              <button onClick={handleLogout} >Log Out</button>
          {loading && <div>Loading...</div>}
          {error && <div style={{ color: 'red' }}>Error: {error}</div>}
          <p>
            Location: {location.latitude ? `Lat: ${location.latitude}, Lon: ${location.longitude}, City: ${cityName}` : (error ? 'Not available' : 'Getting location...')}
          </p>
          
  
          <div className="mainBody">
          
            {!loading && !error && weatherDataByDays && Object.keys(weatherDataByDays).length > 0 && (
              <ShowWeatherComponent data={weatherDataByDays} />
            )}
            {!loading && !error && weatherData && !weatherDataByDays && location.latitude && (
              <div>Weather data could not be loaded or processed correctly.</div>
            )}
  
            <div className="chatbot-container" style={{ paddingTop: "5%", marginLeft: "2%" }}>
              {isChatBotReady && (
                <Chatbot
                  config={baseConfig}
                  messageParser={MessageParser}
                  actionProvider={ActionProvider}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {signupState? (<Signup ToggleSignUpLoginHandler={ToggleSignUpLoginHandler} /> ): ( <Login ToggleSignUpLoginHandler={ToggleSignUpLoginHandler}/>)}
          
        </>
      )
      }
    </div>))
  );
}

export default App;
