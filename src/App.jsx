import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios'; 

const App = () => {
  const URL = "https://api.thecatapi.com/v1/images/search";
  const ACCESS_KEY = process.env.REACT_APP_CAT_API_KEY;
  const [catData, setCatData] = useState({ img: "", attributes: [] });
  const [banned, setBanned] = useState([]);
  console.log("process.env");
  useEffect(() => {
    fetchData();
  }, []); 

  const fetchData = async (retryCount = 0) => {
    const maxRetries = 5; 
    if (retryCount > maxRetries) {
      console.error("Maximum retries reached, failed to fetch cat data without banned attributes.");
    }
  
    try {
      const response = await axios.get(URL, {
        params: {
          limit: "1",
          order: "RAND",
          has_breeds: "1",
          api_key: ACCESS_KEY,
        }
      });
      if (response.data.length) {
        const { url, breeds } = response.data[0];
        let attributes = breeds.length ? [breeds[0].name, breeds[0].origin, breeds[0].energy_level] : [];
  
        const isBannedAttributePresent = attributes.some(attribute => banned.includes(attribute));
  
        if (isBannedAttributePresent) {
          fetchData(retryCount + 1); 
        } else {
          setCatData({ img: url, attributes });
        }
      }
    } catch (error) {
      console.error("Failed to fetch cat data:", error);
    }
  };

  const handleBanned = (attribute) => {
    if (!banned.includes(attribute)) {
      setBanned(prevBanned => [...prevBanned, attribute]);
    }
  };

  return (
    <div className="App">
      <div className="card">
        <h1>Veni Vici</h1>
        <h3>Discover Cat Breeds From Around the World!</h3>
        <div id="discover-button">
          <button onClick={fetchData}>Discover</button>
        </div>
        {catData.img && <img src={catData.img} alt="Cat" width="400"/>}
        <div className='Attributes'>
          {catData.attributes.map((attribute, index) => (
            <button key={index} onClick={() => handleBanned(attribute)}>
              {attribute}
            </button>
          ))}
        </div>
      </div>
      <div className='ban-list'>
        <h5>Banned Display list</h5>
        {banned.map((ban, index) => <div key={index}>{ban}</div>)}
      </div>
    </div>
  );
};

export default App;