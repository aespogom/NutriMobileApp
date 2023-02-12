from food_recognition import foodname_retrieval
from nutrition import fdcID_retrieval, nutrition_retrieval, nutrient_preprocessing
import warnings
warnings.filterwarnings("ignore")

food_picture = "pizza.jpg"
foodname = foodname_retrieval(food_picture)
fdcIDs = fdcID_retrieval([foodname])

api_key = 'iJAojYSzmXpQ7wsfdz3cOFL7ANOxIMu2Kjs22KRC'
nutrients = nutrition_retrieval([foodname], fdcIDs=fdcIDs, api_key=api_key)
preprocessed_nutrients = nutrient_preprocessing(nutrients)

print(preprocessed_nutrients)