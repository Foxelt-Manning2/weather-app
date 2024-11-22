
import './Weather.css'
import weatherIcons from  '../src/assets/weatherIcon'
import axios from 'axios'

import { useState } from 'react'



function Weather(){
  const[loading,setLoading] =useState('');
  const [temp,setTemp] = useState(true)
  const[place,setPlace] =useState(' ')
  const[Visible,setVisible] =useState(false)
  const[error,setError] =useState('')
  const[location,setLocation]=useState('');
  // const[weather,setWeather]= useState('');
  // const[wind,setWind]=useState('');
  // const[precipitation,setPrecipitation]= useState('');
  // const[temperature,setTemperature] = useState(0);
  // const[icon,setIcon]= useState('');
  // const[timezone,setTimezone] =useState('')
  const [data, setData] = useState({weather: "", wind: "", precipitation: "", temperature: 0, icon: "", timezone: ""});

  const key ='sx3oo38czklte6bzgchihzl9un98dv0s4k1hmegu';
  

 const find_places =async()=>{
  try{
     const url =`https://www.meteosource.com/api/v1/free/find_places?text=${location}&language=en&key=${key}`;
     const response = await axios (url)
     return response.data[0].place_id;
  }catch(error){
    console.error(error)
    setError('Failed to find location.Please try again');
    setLoading(false)
  }
 }
 
 const getWeather = async(place_Id) =>{
   try{
    setLoading(true);
     const url =`https://www.meteosource.com/api/v1/free/point?place_id=${place_Id}&language=en&sections=current&units=metric&key=${key}`;
     const response =await axios(url);
    //  const IconC =response.data.current.icon
      setData({
        ...data,
        weather: response.data.current.summary,
        wind: `${response.data.current.wind.speed}km/h \n ${response.data.current.wind.angle}° \n 🔃:${response.data.current.wind.dir} `,
        precipitation: ` Precipitaion:${response.data.current.precipitation.type}`,
        temperature: response.data.current.temperature,
        icon:weatherIcons[response.data.current.icon] || response.data.current.summary['not_available'],
        timezone: response.data.timezone,
      });
          
        //  setIcon(weatherIcons[IconC] || weather['not_available']);
          console.log(response.data.current.icon)
          // setTemperature(response.data.current.temperature);
          // setWeather(response.data.current.summary)
          // setTimezone(response.data.timezone)
          // const PrecipType = response.data.current.precipitation.type;
          // setPrecipitation(` Precipitaion:${PrecipType}`);
          setVisible(true);
           setPlace(place_Id)
          // const Wind =response.data.current.wind
          // const windSpeed =Wind.speed;
          // const windDirection =Wind.dir;
          // const windAngle =Wind.angle;
          
          // setWind(`${windSpeed}km/h \n ${windAngle}° \n 🔃:${windDirection} `)
          setLoading(false)
        }
        catch(error){
          console.error(error)
          setLoading(false)
        }
          
        }
        
        function handleTemperature(){
          if(temp){
            // setTemperature(Math.round((temperature*(9/5) +32)*100)/100);
            setData({...data, temperature: Math.round((data.temperature*(9/5) +32)*100)/100});
          }else{
            // setTemperature((temperature-32)*5 /9 )
            setData({...data, temperature: (data.temperature-32)*5 /9});
          }
          setTemp(c=>!c)
        }
  function ValidateInput(){
    if(location.length <1){
      alert("Please input location")
    }
  }

  const handleButtonClick= async()=> {
    Reset();
    setLoading(true)
    const place_Id =await find_places();
    ValidateInput();
    if(place_Id){
      getWeather(place_Id);
    }
  }

  function Reset(){
 setError('');
//  setIcon('');
    setLocation('');
//  setPrecipitation('');
//  setTemperature('');
//  setTimezone('');
//  setWeather('');
//  setWind('');
    setData({weather: "", wind: "", precipitation: "", temperature: 0, icon: "", timezone: ""})
    setVisible(c =>!c)
  }
return(
    <>
    <div className='weather'>
        <div className='search-bar'>
          <input  type='text' value={location} onChange={(e)=>setLocation(e.target.value)} placeholder='Search'/>
          <button className='search-btn white' onClick={handleButtonClick}>  Search 🔍</button>
        </div> 
       <>
       {loading ?(
        <div className='spinner'>
          .
        </div>
       ):(
         <>
         <div> 
          <p className='bg-red-700 my-8 text-center'>{error}</p>
          {data.timezone}
         {Visible &&(<>
          <p className='location text-white white '>{place}</p><br/>
          <img src={data.icon} />
          <button onClick={handleTemperature} className=' temp bg-red-600 my-4'>Toggle °C/°F</button>

          <p className='Description text-center text-white white '>{data.weather}</p><br/>
          <p className='temperature text-red-600 red'>{data.temperature}{temp ? '℃':'℉'}</p>
         </> 
         )}
         </div>
         <div>
           <p className='float-left text-yellow-700'>{data.wind}</p>
           <p className='float-right mx-2 text-blue-600 red'>{data.precipitation}</p>
         </div>
         </>
       )}
       </>

    </div>
    </>
)
}
export default Weather