import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import FuzzySet from 'fuzzyset';
import * as cte from './utils/constants'
import Spinner from './Spinner';

export default function FoodInfo({backUpData, food}) {
    // Constants that will be used in the whole component
    const [data, setData] = useState(undefined)
    const [mode, setMode] = useState('online');
    const [insulineDose, setInsuline] = useState('');
    const [loading_info, setLoadingInfo] = useState(true);

    const preprocessResponse = (data) => {
        // This function preprocesses the response from the API or local copy
        // From all the results from the database, a text similarity score is computed

        // Args: 
        //     - food (str): name of the dish recognized by the AI model 
        //     - data (array): API / local copy response

        // Returns: A dict object with the highest similarity score

        let a = FuzzySet();
        a.add(food);
        let best_ratio = 0;
        let best_idx = 0;
        let curr_ratio = 0;
        for (let i=0; i< data.length; i++){
            if (data[i]['dataType']==='Branded'){
                try{
                    curr_ratio = a.get(data[i]['brandOwner']+' '+data[i]['description'], [food], 0);
                    if (curr_ratio !== null && curr_ratio[0][0] > best_ratio){
                        best_ratio = curr_ratio[0][0];
                        best_idx = data[i].fdcId;
                    }
                } catch(error){
                    console.log(error);
                }
            } else {
                try{
                    curr_ratio = a.get(data[i]['description'], [food], 0);
                    if (curr_ratio !== null && curr_ratio[0][0] > best_ratio){
                        best_ratio = curr_ratio[0][0];
                        best_idx = data[i].fdcId;
                    }
                } catch(error){
                    console.log(error);
                }
            }
        }

        let best_match = data.filter(d => d.fdcId === best_idx)

        // In the case of using the local copy, two records (one for sugar, one for CH) will be the best match
        if ((best_match).length===2){
            let carbo_value = best_match.find(b => b.nutrientId===cte.ID_CARBO).value
            let sugar_value = best_match.find(b => b.nutrientId===cte.ID_SUGARS).value
            // We are returning a dict objet (key-value) with the same structure than the API response
            return {
                        fdcId: best_idx, 
                        description: best_match[0].description, 
                        foodNutrients: [
                            {nutrientId: cte.ID_CARBO, value: carbo_value},
                            {nutrientId:cte.ID_SUGARS, value: sugar_value}
                        ]
                    }
        } else {
            return best_match[0]
        }
        
    }

    const findSugar = (item) => {
        // This function returns the amount of sugar from a given dish
        let sugar = item.foodNutrients.find((a) => a['nutrientId']===cte.ID_SUGARS)
        return sugar.value
    }

    const findCarbo = (item) => {
        // This function returns the amount of carbohydrates (CH) from a given dish
        let carbo = item.foodNutrients.find((a) => a['nutrientId']===cte.ID_CARBO)
        return carbo.value
    }

    const calcuInsuline = (event, item) => {
        // This function returns the insuline dose needed for a given dish
        let CHO = item['foodNutrients'].find((a) => a['nutrientId']===cte.ID_CARBO).value / cte.CHO_ratio

        // In the case of high glucose level, a correction in the dose is made
        if (event.target.value > 120){
            let HS_correction = (event.target.value - 120) / 50
            setInsuline(Math.round(CHO+HS_correction))
        } else {
            setInsuline(Math.round(CHO));
        }
    };

    const setAndDisplayData = (food) => {
        // This function processes the request to the API or local copy
        // The API will be used first. In case of error (offline), the local copy will be used.

        // Args: 
        //     - food (str): name of the dish recognized by the AI model 

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({generalSearchInput: food}),
            headers: new Headers({'Content-Type': 'application/json'}),
        }
        let url = "https://api.nal.usda.gov/fdc/v1/search?api_key=iJAojYSzmXpQ7wsfdz3cOFL7ANOxIMu2Kjs22KRC"
        fetch(url, requestOptions).then((response) => {
            response.json().then((result) => {
                const final_result = preprocessResponse(result['foods']) // Extract best match
                setData(final_result); // Displays result
                setLoadingInfo(false); // Stops spinner
            })
        })        
        .catch((err) => {
            console.warn(err);
            setMode('offline');
            const final_result = preprocessResponse(backUpData); // Extract best match
            setData(final_result); // Displays result
            setLoadingInfo(false); // Stops spinner
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }

    useEffect(() => {
        setAndDisplayData(food);
        // eslint-disable-next-line
    }, [food])

    return (
        <div id="foodTable">
            {loading_info &&
                <Spinner />
            }
            <div className='offline'>
                {
                    mode === 'offline' ?
                        <div className="alert alert-warning" role="alert">
                            you are in offline mode or some issue with connection
                        </div>
                        : null

                }
            </div>
            { data &&
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Description</th>
                            <th>Sugars (g)</th>
                            <th>Carbohydrates (g)</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        <tr>
                            <td key="id">{data.fdcId}</td>
                            <td key="description">{data.description}</td>
                            <td key="sugars">{findSugar(data)}</td>
                            <td key="carbo">{findCarbo(data)}</td>
                        </tr>
                        
                    </tbody>
                </Table>
            }
            {data && 
                <div className="input-group">
                    <label htmlFor="glucose">Glucose level</label>
                    <input type="number" id="glucose" onChange={(event) => calcuInsuline(event, data)} />
                    <p> Insuline dose: {insulineDose} </p>
                </div>
            }

            <div className="input-group">
                <label>Enter Manually</label>
                <input onKeyDown={(event) => setAndDisplayData(event.target.value)} />
            </div>
        </div>
    )
}
