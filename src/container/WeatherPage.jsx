import * as React   from 'react';
import InputArea    from '../components/InputArea';
import ResultsArea  from '../components/ResultsArea';
const cities        = require('../assets/city.list.json');

class WeatherPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lat:            undefined,
            name:           undefined,
            long:           undefined,
            error:          undefined,
            zipcode:        undefined,
            searchBy:       'name',
            forecasts:      [],
            USCities:       [],
            units:          'imperial',
            currentSearch:  undefined
        };
    }

    componentDidMount() {
        const USCities = cities.filter(c => c.country === 'US');
        this.setState({ USCities });

        // Get user current location
        this.ipLookUp();
    }

    ipLookUp = () => 
    {
        const API_KEY   = process.env.REACT_APP_IP_STACK_KEY;

        fetch(`http://api.ipstack.com/check?access_key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                this.setState({ zipcode: data.zip });
                this.weatherLookUp(`zip=${data.zip}`);
            })
            .catch(err => console.log('err', err))
    } 

    weatherLookUp = (query) => 
    {
        const API_KEY   = process.env.REACT_APP_OPEN_WEATHER_KEY;
        const baseUrl   = `http://api.openweathermap.org/data/2.5/forecast?`
        const units     = this.state.units === 'metric' ? `&units=metric` :  `&units=imperial`

        const url = baseUrl + query + units + `&APPID=${API_KEY}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.cod === '200') {
                    this.setState({ 
                        forecasts: data.list,
                        currentSearch: data.city.name + ', ' + data.city.country,
                    });
                } else {
                    this.setState({ 
                        error: data.message, 
                        forecasts: [] 
                    })
                }
                
            })
            .catch(err => {
                console.log('err', err);
                this.setState({ error: 'invalid search' });
            });
    }
    
    checkWeather = () => 
    {
        const { searchBy, name, lat, long, zipcode, USCities } = this.state;

        // Show appropriate error message if user tries to search without
        // giving any params
        if (!name && !zipcode && !lat && !long) {
            let error;
            switch(searchBy) {
                case 'name':
                    error = 'please provide a name';
                    break;
                case 'zipcode':
                    error = 'please provide a zipcode';
                    break;
                case 'lat/long':
                    error = 'please provide coordinates';
                    break;
                default:
                    error = 'invalid search';
            }

            this.setState({ error });
            return;
        }
        
        // Find the requested city in the list of available cities
        let city;
        
        // First check if a zipcode is present even if searchBy is name
        // could mean that we are still on the first render of the page
        if (searchBy === 'name' && zipcode && !name) {
            city = '';

        // if we have both a name and a zipcode, continue to the next steps
        } else if (searchBy === 'name' && zipcode && name) {
            city = USCities.find(USCity => USCity.name.toLowerCase() === name.toLowerCase());

        } else if (searchBy === 'lat/long') {
            city = USCities.find(USCity => 
                USCity.coord.lat === parseFloat(lat) && USCity.coord.lon === parseFloat(long)
            );
        };
        

        // If we are searching by name or lat/long anf found the city, 
        // make the call to the weather API with the cityID
        if ((searchBy === 'name' && city) || (searchBy === 'lat/long' && city)) {
            this.weatherLookUp(`id=${city.id}`)
        
        // If we are searching by zipcode, make the call to the weather API
        // with the provided zipcode
        } else if (zipcode) {
            this.weatherLookUp(`zip=${zipcode}`)  
        
        // If none of the above are valid, inform the user
        } else {
            this.setState({ error: 'unsuccessful search'});
        }
    }

    handleInputChange = (event) =>
    {
        const id    = event.target.id;
        const value = event.target.value;

        this.setState({ 
            [id]: value,
            error: undefined 
        });
    }

    handleKeyDown = (event) =>
    {
        if (event.key === 'Enter') {
            this.checkWeather();
        }

        return;
    }

    handleSwitchSearch = (event) =>
    {   
        this.setState({ 
            searchBy: event.target.id,
            error: undefined
        });
    }

    handleSwitchUnits = (event) =>
    {   
        this.setState(
            { units: event.target.id },
            () => this.checkWeather()
        );
    }

    render() {
        return (
            <div className="weather-page">
                <h2>Show me the weather</h2>
                <InputArea
                    units={this.state.units}
                    searchBy={this.state.searchBy}
                    checkWeather={this.checkWeather}
                    handleKeyDown={this.handleKeyDown}
                    handleInputChange={this.handleInputChange}
                    handleSwitchUnits={this.handleSwitchUnits}
                    handleSwitchSearch={this.handleSwitchSearch}
                />

                <ResultsArea 
                    units={this.state.units}
                    error={this.state.error}
                    forecasts={this.state.forecasts}
                    currentSearch={this.state.currentSearch}
                />
            </div>
        );
    }
}

export default WeatherPage;