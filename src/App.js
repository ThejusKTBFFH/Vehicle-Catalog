import {useEffect, useState} from "react"
import './App.css';
import axios from "axios"

function App() {



  const [data,setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState("all");
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json"
        );
        setData(response.data.Results);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  
 
  const handleRowClick = async (manufacturerId) => {
    const response = await axios.get(
      `https://vpic.nhtsa.dot.gov/api/vehicles/getmanufacturerdetails/${manufacturerId}?format=json`
    );
    setSelectedManufacturer(response.data.Results[0]);
  };

  
  const renderManufacturerDetails = () => {
    if (!selectedManufacturer) return null;

    return (
      <div className="popup">
        <h2>{selectedManufacturer.Mfr_Name}</h2>
        <p>
          Registered Name: {selectedManufacturer.Mfr_CommonName || "N/A"}
        </p>
        <p>
          Current Head:{" "}
          {`${selectedManufacturer.Mfr_CEOName} (${selectedManufacturer.Mfr_CEOTitle})` ||
            "N/A"}
        </p>
        <p>Address: {selectedManufacturer.Mfr_Address || "N/A"}</p>
        <p>State: {selectedManufacturer.Mfr_State || "N/A"}</p>
      </div>
    );
  };


  const handleTypeChange = (event) =>{
      setSelectedType(event.target.value)
  }

  const handleSearch =(event)=>{
    setSearchQuery(event.target.value)
    const filtered = data.filter((item)=>
    item.Mfr_Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setData(filtered);

    
  }
  return (
    <div className="App">
        <h1>Vehicle Manufacturers</h1>
      <div>
        <label htmlFor="vehicleType"> Filter by Vehicle type</label>
        <select id="vehicleType" value={selectedType} onChange={handleTypeChange}>

          <option value="all">All</option>
          <option value="Passenger Car">Passenger Car</option>
          <option value="Truck">Truck</option>
          <option value="Multi Purpose Vehicle">Multi Purpose Vehicle</option>
          <option value="Motorcycle">Motorcycle</option>
          <option value="Low Speed Vehicle">Low Speed Vehicle</option>
          <option value="Off Road Vehicle">Off Road Vehicle</option>
          <option value="Bus">Bus</option>

        </select>
      </div>

      <div>
        <label htmlFor="searchInput"> Search by Vehicle Name:</label>
        <input type="text"id="searchInput" value={searchQuery} onChange={handleSearch}/>

      </div>

      {renderManufacturerDetails()}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item)=>{

            return(



              <tr key={item.Make_ID}  onClick={() => handleRowClick(item.Mfr_ID)}>
              <td>{item.Mfr_Name}</td>
              <td>{item.Country}</td>
              <td>{item.VehicleTypeName}</td>


            </tr>

            )

            
              
            
            
          })}
        </tbody>
      </table>

     


    

      
    </div>
  );
}

export default App;
