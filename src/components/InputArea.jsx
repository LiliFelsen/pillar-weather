import * as React           from 'react';
import { Input, Button }    from 'semantic-ui-react';

const InputArea = (props) => 
{
    return (
        <div className='actions-container'>
            <div className='search-input'>
                {props.searchBy === 'name' &&
                    <Input 
                        id='name'
                        focus={true}
                        icon='search'
                        iconPosition='left'
                        placeholder='Enter city name'
                        onKeyDown={props.handleKeyDown}
                        onChange={props.handleInputChange}
                    />    
                }

                {props.searchBy === 'lat/long' &&
                    <div className='multiple-inputs'>
                        <Input 
                            id='long'
                            focus={true}
                            icon='search'
                            iconPosition='left'
                            onKeyDown={props.handleKeyDown}
                            placeholder='Enter city longitute'
                            onChange={props.handleInputChange}
                        />

                        <Input 
                            id='lat'
                            focus={true}
                            icon='search'
                            iconPosition='left'
                            onKeyDown={props.handleKeyDown}
                            placeholder='Enter city latitude' 
                            onChange={props.handleInputChange}
                        />
                    </div>
                }

                {props.searchBy === 'zipcode' &&
                    <Input 
                        id='zipcode'
                        focus={true}
                        icon='search'
                        iconPosition='left'
                        onKeyDown={props.handleKeyDown}
                        placeholder='Enter city zipcode'
                        onChange={props.handleInputChange}
                    />
                }
            </div>
                
                
            
            <div className='search-actions'>
                <div className='units-switch'>
                    <span 
                        id='metric' 
                        onClick={props.handleSwitchUnits}
                        className={props.units === 'metric' ? 'active' : ''}
                    >
                        °C
                    </span>

                    <span 
                        id='imperial'
                        onClick={props.handleSwitchUnits} 
                        className={props.units === 'imperial' ? 'active' : ''}
                    >
                        °F
                    </span>
                </div>
                <Button onClick={props.checkWeather} className='search-button'>
                    Search
                </Button> 
                <div className='search-switch'>
                    <div>
                        {props.searchBy !== 'lat/long' && 
                            <div id='lat/long' onClick={props.handleSwitchSearch}>Search by lat/long</div>}
                        
                        {props.searchBy !== 'zipcode' && 
                            <div id='zipcode' onClick={props.handleSwitchSearch}>Search by zipcode</div>}

                        {props.searchBy !== 'name' && 
                            <div id='name' onClick={props.handleSwitchSearch}>Search by name</div>}
                    </div>
                </div>
            </div>
             
        </div>
    )
};

export default InputArea;