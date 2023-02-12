import React, { Component } from 'react';
import HomeView from './HomeView';
import axios from 'axios';
import styles from './HomeStyle';
import {
    View,
    Text,
    TouchableOpacity
} from "react-native";
import FuzzySet from 'fuzzyset';
class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            fromAxios: false,
            axiosData: null
        };
    }
    preprocessResponse = (data) => {
        let a = FuzzySet();
        a.add('pizza');
        let best_ratio = 0;
        let best_idx = 0;
        let curr_ratio = 0;
        for (let i=0; i< data.length; i++){
            if (data[i]['dataType']=='Branded'){
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
    }
    postNutriDDBB = () => {
        this.setState({
            loading: true,
        });
        axios.post("https://api.nal.usda.gov/fdc/v1/search?api_key=iJAojYSzmXpQ7wsfdz3cOFL7ANOxIMu2Kjs22KRC", {
            generalSearchInput: 'pizza'
        }).then(response => {
                setTimeout(() => {
                    console.log(response.data.foods);
                    this.setState({
                        loading: false,
                        axiosData: this.preprocessResponse(response.data.foods)
                    })
                }, 2000)
            })
            .catch(error => {
                console.log(error);
            });
    }
    FlatListSeparator = () => {
        return (
            <View style={{
                height: .5,
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
            }}
            />
        );
    }
    renderItem = (data) => {
        return (
            <TouchableOpacity style={styles.list}>
                <Text style={styles.lightText}>{data.item.description}</Text>
            </TouchableOpacity>
        )

    }
    render() {
        const { fromAxios, loading, axiosData } = this.state
        return (
            <HomeView
                postNutriDDBB={this.postNutriDDBB}
                loading={loading}
                fromAxios={fromAxios}
                axiosData={axiosData}
                FlatListSeparator={this.FlatListSeparator}
                renderItem={this.renderItem}
            />
        );
    }
}

export default HomeScreen;