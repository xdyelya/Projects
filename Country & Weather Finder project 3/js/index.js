async function findCountry() {
    const countryName = document.getElementById('countryInput').value;
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('result');

    if (!countryName) return;

    loader.style.display = 'block';
    resultDiv.innerHTML = '';

    try {

        const countryResponse = await fetch(`https://restcountries.com/v3/name/${countryName}`);
        const countryData = await countryResponse.json();
        const country = countryData[0];
        const capital = country.capital[0];

        const weatherResponse = await fetch(`https://wttr.in/${capital}?format=j1`);
        const weatherData = await weatherResponse.json();
        const currentWeather = weatherData.current_condition[0];

        resultDiv.innerHTML = `
            <h2>Country: ${country.name.common}</h2>
            <p>Capital: ${capital}</p>
            <p>Current weather: ${currentWeather.weatherDesc[0].value}, ${currentWeather.temp_C}° Wind: ${currentWeather.winddir16Point} ${currentWeather.windspeedKmph} km/h</p>
            <h3>Bordering countries:</h3>
        `;

        const borderCountries = country.borders || [];
        const borderRequests = borderCountries.map(code => fetch(`https://restcountries.com/v3/alpha/${code}`).then(res => res.json()));
        const borderCountriesData = await Promise.all(borderRequests);

        for (const borderCountryData of borderCountriesData) {
            const borderCountry = borderCountryData[0];
            const borderCapital = borderCountry.capital[0];

            const borderWeatherResponse = await fetch(`https://wttr.in/${borderCapital}?format=j1`);
            const borderWeatherData = await borderWeatherResponse.json();
            const borderWeather = borderWeatherData.current_condition[0];

            resultDiv.innerHTML += `
                <p>Country name: ${borderCountry.name.common}</p>
                <p>Capital: ${borderCapital}</p>
                <p>Current weather: ${borderWeather.weatherDesc[0].value}, ${borderWeather.temp_C}° Wind: ${borderWeather.winddir16Point} ${borderWeather.windspeedKmph} km/h</p>
            `;
        }

    } catch (error) {
        resultDiv.innerHTML = `<p>Error: Could not fetch the data.</p>`;
        console.error(error);
    } finally {
        loader.style.display = 'none';
    }
}
