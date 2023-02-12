import React, { Component } from 'react'
import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native';
import styles from './HomeStyle';
const HomeView = (props) => {
    const { postNutriDDBB, fromAxios, axiosData, renderItem, FlatListItemSeparator, loading } = props
    return (
        <View style={styles.parentContainer}>
            <View>
                <Text style={styles.textStyle}>Welcome to your personal diabetic assistant</Text>
            </View>
            <View style={{ margin: 18 }}>
                <Button
                    title={'Take a snapshot of your food'}
                    onPress={postNutriDDBB}
                    color='green'
                />
            </View>
            <FlatList
                    data={axiosData}
                    ItemSeparatorComponent={FlatListItemSeparator}
                    renderItem={item => renderItem(item)}
                    keyExtractor={item => item.fdcId.toString()}
            />

            {loading &&
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#0c9" />
                    <Text style={{fontSize:16,color:'red'}}>Loading Data...</Text>
                </View>
            }
        </View>
    )
}
export default HomeView;