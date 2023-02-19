import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import FuzzySet from 'fuzzyset';
import * as cte from './utils/constants'
import Spinner from './Spinner';

export default function FoodInfo(backUpData, food) {
    const [data, setData] = useState(undefined)
    const [mode, setMode] = useState('online');
    const [insulineDose, setInsuline] = useState('');
    const [loading_info, setLoadingInfo] = useState(false);

    console.log('foodinfo:', food.name_);

    const preprocessResponse = (data) => {
        let a = FuzzySet();
        a.add(food.name_);
        let best_ratio = 0;
        let best_idx = 0;
        let curr_ratio = 0;
        for (let i=0; i< data.length; i++){
            if (data[i]['dataType']==='Branded'){
                try{
                    curr_ratio = a.get(data[i]['brandOwner']+' '+data[i]['description'], ['cereal'], 0);
                    if (curr_ratio !== null && curr_ratio[0][0] > best_ratio){
                        best_ratio = curr_ratio[0][0];
                        best_idx = data[i].fdcId;
                    }
                } catch(error){
                    console.log(error);
                }
            } else {
                try{
                    curr_ratio = a.get(data[i]['description'], ['cereal'], 0);
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
        console.log('Best match: ', best_match);

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
        let sugar = item.foodNutrients.find((a) => a['nutrientId']===cte.ID_SUGARS)
        return sugar.value
    }

    const findCarbo = (item) => {
        let carbo = item.foodNutrients.find((a) => a['nutrientId']===cte.ID_CARBO)
        return carbo.value
    }

    const calcuInsuline = (event, item) => {
        // https://www.diabeteseducationandresearchcenter.org/news/type-2-diabetes-how-to-calculate-insulin-doses
        let CHO = item['foodNutrients'].find((a) => a['nutrientId']===cte.ID_CARBO).value / cte.CHO_ratio
        if (event.target.value > 120){
            let HS_correction = (event.target.value - 120) / 50
            setInsuline(Math.round(CHO+HS_correction))
        } else {
            setInsuline(Math.round(CHO));
        }
    };

    useEffect(() => {
        setLoadingInfo(true);
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({generalSearchInput: food.name_}),
            headers: new Headers({'Content-Type': 'application/json'}),
        }
        let url = "https://api.nal.usda.gov/fdc/v1/search?api_key=iJAojYSzmXpQ7wsfdz3cOFL7ANOxIMu2Kjs22KRC"
        fetch(url, requestOptions).then((response) => {
            response.json().then((result) => {
                const final_result = preprocessResponse(result['foods'])
                setData(final_result);
                setLoadingInfo(false);
            })
        })        
        .catch((err) => {
            console.warn(err);
            setMode('offline');
            const final_result = preprocessResponse(backUpData);
            setData(final_result);
            setLoadingInfo(false);
        })
    }, [])

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
        </div>
    )
}