import csv
import json
import pandas as pd


def make_json(csvFileFood, csvFileNutrients, jsonFilePath):

	## Read csv and convert it into a pandas dataframe (kind of table)
	dt = pd.read_csv(csvFileFood)
	## We keep only the columns of interest from this csv --> ID and description
	dt = dt[['fdc_id', 'data_type', 'description']]
	print(dt.shape)
	n = 1666279
	dt = dt.drop(dt.sample(n=n).index)

	## Read csv and convert it into a pandas dataframe (kind of table)
	dt2 = pd.read_csv(csvFileNutrients)
	## We keep only the columns of interest from this csv --> ID, nutrient and amount
	dt2 = dt2[['fdc_id', 'nutrient_id', 'amount']]
	## We filter the table by the nutrients we are interested --> sugar and carbohydrates
	ID_SUGARS = 2000
	ID_CARBO = 1005
	dt2 = dt2[(dt2['nutrient_id']==ID_CARBO) | (dt2['nutrient_id']==ID_SUGARS)]

	## Merge both dataframes by the ID
	dt_final = pd.merge(dt, dt2, on=["fdc_id"])
	
	## We change the names of the columns so they coincide with the names from the online mode
	dt_final = dt_final.rename(columns={'fdc_id': 'fdcId', 'nutrient_id': 'nutrientId', 'amount': 'value', 'data_type': 'dataType'})
	
	## Convert to json but row by row orientation
	jsonObject = dt_final.to_dict('records')

	with open(jsonFilePath, 'w') as outFile:
		outFile.write(json.dumps(jsonObject, indent=4))
	outFile.close()
		

csvFileFood = r'./PWANutriApp/src/utils/food.csv'
csvFileNutrients = r'./PWANutriApp/src/utils/food_nutrient.csv'
jsonFilePath = r'./PWANutriApp/src/utils/food.json'

make_json(csvFileFood, csvFileNutrients, jsonFilePath)

