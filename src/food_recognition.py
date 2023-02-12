from transformers import pipeline, AutoFeatureExtractor
from optimum.intel.openvino import OVModelForImageClassification
import torch

def find_best_match(outputs):

    best_match = ' '.join(outputs[0]['label'].split('_'))

    return best_match

def foodname_retrieval(image):
    model_id = "echarlaix/vit-food101-int8"
    model = OVModelForImageClassification.from_pretrained(model_id)
    feature_extractor = AutoFeatureExtractor.from_pretrained(model_id)
    pipe = pipeline("image-classification", model=model, feature_extractor=feature_extractor)
    
    with torch.no_grad():
        outputs = pipe(image)

    best_match = find_best_match(outputs)
    return best_match

# usage
# print(foodname_retrieval("apple_pie.jpg"))