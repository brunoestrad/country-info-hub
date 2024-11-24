import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Population from "./Population";

function CountryInfo(){

    // Initialize location function
    const location = useLocation();
    const { selectedCountry } = location.state; // Destructure the passed state to access state passed from <CountrySelect/>
    // Initialze states for data fetching
    const [countriesFlag, setCountriesFlag] = useState(null);
    const [countryCapital, setCountryCapital] = useState(null);
    const [countryCurrency, setCountryCurrency] = useState(null);
    const [countryCities, setCountryCities] = useState(null);
    // Errors states
    const [errorFlag, setErrorFlag] = useState(null);
    const [errorCapital, setErrorCapital] = useState(null);
    const [errorCurrency, setErrorCurrency] = useState(null);
    const [errorCities, setErrorCities] = useState(null);
    // Initialize location function
    const navigate = useNavigate();

    // Fetch flags
    useEffect(() => {
        const fetchCountriesFlag = async () => {
            try{
                const response = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images");

                // Check if response is ok
                if (!response.ok){
                    throw new Error("Failed to fetch countries flags data");
                }

                // Store result from JSON file
                const result = await response.json();
                // Set countriesFlag as the data object
                setCountriesFlag(result.data)

            } catch (error){
                setErrorFlag(error.message);
            }
        }
        fetchCountriesFlag();
        
    }, []) // Empty array to run only when page is loaded

    // Fetch currency for selected country
    useEffect(() => {
        const fetchCountryCurrency = async () => {
            try{   
                // Fetch using POST method
                const response = await fetch("https://countriesnow.space/api/v0.1/countries/currency", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", // Specifying the type of the body to server
                    },
                    body: JSON.stringify({country: selectedCountry}), // Convert JavaScript object to JSON string so API con properly read the body
                });

                if (!response.ok){
                    throw new Error("Failed to fetch country's currency");
                }

                const result = await response.json();
                // Store only currency value
                setCountryCurrency(result.data.currency)

            } catch (error){
                setErrorCurrency(error.message);
            }
        }
        fetchCountryCurrency();
        
    }, [])

    // Fetch selected country capital
    useEffect(() => {
        const fetchCountryCapital = async () => {
            try{
                // Send POST request to API
                const response = await fetch("https://countriesnow.space/api/v0.1/countries/capital", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", // Specifying the type of the body to server
                    },
                    body: JSON.stringify({country: selectedCountry}), // Convert JavaScript object to JSON string so API con properly read the body
                });

                if (!response.ok){
                    throw new Error("Failed to fetch country's capital");
                }

                const result = await response.json();
                // Store only capital value
                setCountryCapital(result.data.capital)

            } catch (error){
                setErrorCapital(error.message);
            }
        }
        fetchCountryCapital();
        
    }, [])

    // Fetch selected country cities
    useEffect(() => {
        const fetchCountryCities = async () => {
            try{
                const response = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({country: selectedCountry}),
                });

                if (!response.ok){
                    throw new Error("Failed to fetch country's capital");
                }

                const result = await response.json();
                setCountryCities(result.data)

            } catch (error){
                setErrorCities(error.message);
            }
        }
        fetchCountryCities();
        
    }, [])

    // Check if errors come up and display as a div if they do
    if (errorFlag || errorCurrency || errorCapital || errorCities) {
        return <div>Error: {error}</div>
    }
    // Check if any states that will have data fetched stored in them are empty and display loading
    if(!countriesFlag || !countryCurrency || !countryCapital || !countryCities){
        return <div>Loading...</div>
    }

    // Return button
    const handleClick = () => {
        navigate("/");
    }

    return (
        <>
        <p onClick={handleClick} className="return">← return</p>
        <div className="container">
            <div className="country-info">
                {countriesFlag
                    // Filter the countriesFlag array to return the country that matches the selectedCountry
                    .filter((country) => country.name === selectedCountry)

                    // Map over the filtered result to display the country's flag
                    .map((country) => (
                        <img key={country.iso3} src={country.flag} alt={`${selectedCountry} flag`}></img>
                    ))
                }
                <h1 className="title">{selectedCountry}</h1>
                <ul>
                    {/* Go to Population.jsx with name as props */}
                    <li className="population" key="population"><Population name={selectedCountry}/></li>
                    <li className="currency" key="currency">Currency: {countryCurrency}</li>
                    <li className="capital" key="capital">Capital: {countryCapital}</li>
                    <li className="cities" key="cities">Cities:
                    <select className="select-cities">
                        {/* Map over countryCities array to display every city as an option */}
                        {countryCities.map((city) => (
                            <option key={city}>{city}</option>
                        ))};
                   </select>
                   </li>
                </ul>
            </div>
        </div>
        </>
    )
}

export default CountryInfo;