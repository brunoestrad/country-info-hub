import { useEffect,useState } from "react"; 
import { useNavigate } from "react-router-dom";

function CountrySelect (){

    // Initialize navigate function
    const navigate = useNavigate();
    // Initialize states
    const [countriesData, setCountriesData] = useState();
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [error, setError] = useState(null);

    // Fetch all countries data
    useEffect(() => {
        const fetchCountriesData = async () => {
            // Error handling
            try {  
                // GET method for countries info
                const response = await fetch("https://countriesnow.space/api/v0.1/countries/capital");

                // Check if response is ok
                if(!response.ok) {
                    throw new Error("Failed to fetch countries data");
                }

                // Store JSON file on result
                const result = await response.json();
                // Get data object within result fetched
                setCountriesData(result.data);

            } catch (error) {
                // Catch error and use useState to set message
                setError(error.message);
            }
        }
        fetchCountriesData();
    }, []) // Dependancy array to run only when page is loaded

    // Return a <div> if error is encountered
    if(error) {
        return <div>Error: {error}</div>
    }
    // Return loading when countriesData is not populated with data yet
    if(!countriesData){
        return <div>Loading countries data...</div>
    }

    // Handle country submission
    const handleSubmit = () => {
        // Check if there is a value on select input
        if (selectedCountry) {
            // Make sure the value isn't "Select an option"
            (selectedCountry == "Select an option")
            ? alert("Please select a country.")
            // If country is selected navigate to /country-info passing the state of selectedCountry
            : navigate("/country-info", { state: {selectedCountry} });

        } else {
            alert("Please select a country.")
        }

    };

    // Update selected country
    const handleSelectionChange = (event) => {
        setSelectedCountry(event.target.value); // State update with select value
    }

    return (
        <div className="container">
            <div className="select-country">
                <h1>Country data finder</h1>
                <label className="label">Select a country to learn more:</label>
                {/* Call function to update selectedCountry state */}
                <select onChange={handleSelectionChange}> 
                    <option>Select an option</option>
                    {/* Map array to get each country's info within countriesData array */}
                    {countriesData.map((country) => (
                        // Add key as iso3 and display country's name as option
                        <option key={country.iso3}>{country.name}</option>
                    ))}
                </select><br/>
                {/* Call function to go to country info page if country is selected */}
                <button onClick={handleSubmit} type="submit">Check information</button>
            </div>
        </div>
    )

}

export default CountrySelect;