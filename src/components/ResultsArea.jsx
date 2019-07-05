import * as React       from 'react';
import * as moment from 'moment';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend,  CartesianGrid } from 'recharts';


class ResultsArea extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            unit: undefined
        };
    };

    // Make sure we always show the appropriate unit symbol
    componentDidMount() {
        this.setCurrentUnit(this.props.units);
    }

    // Make sure we always show the appropriate unit symbol
    componentDidUpdate(prevProps) {
        if (this.props.units !== prevProps.units) {
          this.setCurrentUnit(this.props.units);
        };
    }

    setCurrentUnit = (unit) => 
    {
        const unitSymbol = unit === 'metric' ? '°C' : '°F';
        this.setState({ unit: unitSymbol });
    }


    customTooltip = ({ active, payload, label }) => 
    {
        const time = moment().add((label * 3), 'hours').format("ddd, MMM Do - hA");
    
        if (active) {
            return (
                <div className="custom-tooltip">
                    <p className="date">{time}</p>
                    <p className="label">{payload[0].value}{this.state.unit}</p>
                </div>
            );
        }
    
        return null;
    };

    customXAxis = (tick) => 
    {
        // We know the API response has a forecast every 3 hours
        // so we are using that to format our Axis
        const time = moment().add((tick * 3), 'hours').format("hA");
        return time;
    }

    renderCurrent = () =>
    {
        const { forecasts, currentSearch } = this.props;
        const { unit } = this.state;

        if (forecasts.length > 0) {
            return (
                <div className="current-info">
                    <h4>{currentSearch}</h4>
                    <div className="details">
                        <span className="label">Current temperature:</span> 
                        <span className="data">{forecasts[0].main.temp}{unit}</span>
                    </div>
                    <div className="details">
                        <span className="label">Current humidity: </span>
                        <span className="data">{forecasts[0].main.humidity}%</span>
                    </div>
                    <div className="details">
                        <span className="label">Current pressure: </span>
                        <span className="data">{forecasts[0].main.pressure} hPa</span>
                    </div>
                </div>
            )
        }
    }

    renderForecasts = () =>
    {   
        const { forecasts } = this.props;
        const data = forecasts.map(forecast => forecast.main);
        
        if (forecasts.length > 0) {
            return (
                <AreaChart width={730} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#85b7d9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#85b7d9" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis tickFormatter={this.customXAxis} interval={3} />
                    <YAxis />
                    <Tooltip content={this.customTooltip} />
                    <Legend />
                    <Area type="monotone" dataKey="temp" stroke="#85b7d9" fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
            )
        }
    }

    render() {
        const { forecasts, error } = this.props;
        
        return (
            <div className='results-container'>
                {forecasts.length === 0 && error &&
                    <div className='error'>{error[0].toUpperCase() + error.slice(1)}</div>}
                
                {this.renderCurrent()}
                {this.renderForecasts()}
            </div>
        );
    }
}

export default ResultsArea;