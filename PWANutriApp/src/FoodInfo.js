import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import FuzzySet from 'fuzzyset';
import * as cte from './utils/constants'

export default function FoodInfo() {
    const [data, setData] = useState([])
    const [mode, setMode] = useState('online');
    const preprocessResponse = (data) => {
        let a = FuzzySet();
        a.add('pizza');
        let best_ratio = 0;
        let best_idx = 0;
        let curr_ratio = 0;
        if (data['foods']){
            data = data.foods;
            for (let i=0; i< data.length; i++){
                if (data[i]['dataType']==='Branded'){
                    try{
                        curr_ratio = a.get(data[i]['brandOwner']+' '+data[i]['description'], ['pizza'], 0);
                        if (curr_ratio !== null && curr_ratio[0][0] > best_ratio){
                            best_ratio = curr_ratio[0][0];
                            best_idx = i;
                        }
                    } catch(error){
                        console.log(error);
                    }
                } else {
                    try{
                        curr_ratio = a.get(data[i]['description'], ['pizza'], 0);
                        if (curr_ratio !== null && curr_ratio[0][0] > best_ratio){
                            best_ratio = curr_ratio[0][0];
                            best_idx = i;
                        }
                    } catch(error){
                         console.log(error);
                    }
                }
            }
            console.log('Best match: ', data.filter(d => d.fdcId === data[best_idx].fdcId));
            return data.filter(d => d.fdcId === data[best_idx].fdcId)
        } else {
            return 'Error'
        }
        
    }
    const findSugar = (item) => {
        let sugar = item['foodNutrients'].find((a) => a['nutrientId']===cte.ID_SUGARS)
        return sugar.value
    }
    const findCarbo = (item) => {
        let carbo = item['foodNutrients'].find((a) => a['nutrientId']===cte.ID_CARBO)
        return carbo['value']
    }
    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({generalSearchInput: 'pizza'}),
            headers: new Headers({'Content-Type': 'application/json'}),
        }
        let url = "https://api.nal.usda.gov/fdc/v1/search?api_key=iJAojYSzmXpQ7wsfdz3cOFL7ANOxIMu2Kjs22KRC"
        fetch(url, requestOptions).then((response) => {
            response.json().then((result) => {
                console.warn(result)
                const final_result = preprocessResponse(result)
                setData(final_result)
                localStorage.setItem("foodInfo", JSON.stringify(final_result)) // store data for offline usage 
            })
        }).catch(err => {
            setMode('offline')
            let collection = localStorage.getItem('foodInfo'); // get data from cache in offline modus
            setData(JSON.parse(collection))
        })
    }, [])
    return (
        <div>
            <div>
                {
                    mode === 'offline' ?
                        <div className="alert alert-warning" role="alert">
                            you are in offline mode or some issue with connection
                        </div>
                        : null

                }
            </div>
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
                    {
                        data.map((item) => (
                            <tr>
                                <td key="id">{item.fdcId}</td>
                                <td key="description">{item.description}</td>
                                <td key="sugars">{findSugar(item)}</td>
                                <td key="carbo">{findCarbo(item)}</td>
                            </tr>
                        ))
                    }

                </tbody>
            </Table>
        </div>
    )
}