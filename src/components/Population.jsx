import { useState, useEffect } from "react";
import PropTypes from 'prop-types'

function Population(props){

    // Initialize states
    const [countriesPopulation, setCountriesPopulation] = useState([]);
    const [error, setError] = useState(null);
    const [totalPopulation, setTotalPopulation] = useState(0);
    const selectedCountry = props.name; // Get props passed from <CountrySelect />

    // Fetch population data
    useEffect(() => {
        const fetchCountriesPopulation = async () => {
            try{   
                const response = await fetch("https://countriesnow.space/api/v0.1/countries/population/cities"); // Could have used different API request

                if(!response.ok){
                    throw new Error("Failed to fetch countries population data");
                }

                const result = await response.json();
                // Store data object within countriesPopulation state
                setCountriesPopulation(result.data);

            } catch (error) {
                setError(error.message);
            }
        }
        fetchCountriesPopulation();
    }, []) 

    // useEffect hook to calculate the total population value for the selectedCountry
    useEffect(() => {
        const total = countriesPopulation
            // Filter the countriesPopulation array to find the selectedCountry
            .filter((country) => country.country === selectedCountry)
            // Reduce the filtered array to sum up the population counts from different cities
            .reduce((sum,entry) => {
                // For each country entry, sum up the population from each city in the populationCounts array
                const cityTotal = entry.populationCounts.reduce(
                    (citySum, count) => citySum + parseInt(count.value),0);
                return sum + cityTotal; // Add city population to the total
            }, 0); // Initialize the sum to 0

            // Update state
            setTotalPopulation(total);
    }, [countriesPopulation, selectedCountry]) // Re-run when countriesPopulation or selectedCountry is updated

    // Display <div> if error exists
    if (error) {
        return <div>Error: {error}</div>
    }
    // Display <div> if countriesPopulation is empty
    if(!countriesPopulation){
        return <div>Loading...</div>
    }  

    return(
        <>
            {/* Address for errors */}
            <p>{(totalPopulation == 0) ? "Population data not available for this country" : "Population: " + totalPopulation.toLocaleString()}</p>
        </>
    );

}

// Set props type
Population.propTypes = {
    name: PropTypes.string
}

export default Population; 