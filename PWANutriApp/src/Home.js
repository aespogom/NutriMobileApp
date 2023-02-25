import React, {useRef, useEffect, useState} from 'react';
import FoodInfo from './FoodInfo';
import {TbRepeat} from 'react-icons/tb';
import {FiCamera} from 'react-icons/fi';
import {MdOutlineSendToMobile} from 'react-icons/md';
import Spinner from './Spinner';
import ndarray from 'ndarray';
import ops from 'ndarray-ops';
import { food101topK } from './utils';
import data from './utils/food.json';
import Button from 'react-bootstrap/Button';
import * as cte from './utils/constants'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Home() {
  
  // Constants that will be used in the whole component
  let hasWebgl = false;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  // Report the result.
  if (gl && gl instanceof WebGLRenderingContext) {
    hasWebgl = true;
  } else {
    hasWebgl = false;
  }
  console.log('WebGL enabled:', hasWebgl);

  let state = {
    model: null,
    modelLoaded: false,
    modelLoading: false,
    modelRunning: false,
    imageLoadingError: false,
    loadingPercent: 0,
    classifyPercent: 0,
    topK: null,
    hasWebgl,
    url: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1600'
  };

  // Let var and const var --> let variables can change the value but constant dont
  // UseState is a function that creates a constant and a function related to each other
  // the function updates the value of the constant
  // constants defined here will be available to any other function in the script
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasFood, setHasFood] = useState(false);
  const [backUpData, setBackUpData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState(false);
  const [foodpred, setFoodPred] = useState(undefined);

  // Ask for camera permissions and displays the video in the screen
  const getVideo = () => {
    navigator.mediaDevices
    .getUserMedia({
      video: {width: 1920, height: 1080, facingMode: 'environment'}
    })
    .then(stream => {
      let video = videoRef.current;
      video.srcObject = stream;
      video.play();
    })
    .catch(err => {
      console.log(err);
    })
  }

  const loadModel = () => {
    // This function loads the food recognition mode

    console.log('Loading Model');
    const model = new window.KerasJS.Model({
      filepaths: {
        model: 'model.json' ,
        weights: 'model4b.10-0.68_weights.buf',
        metadata: 'model4b.10-0.68_metadata.json'
      },
      gpu: state.hasWebgl,
      layerCallPauses: true
    });

    const waitTillReady = model.ready();

    waitTillReady.then(() => {
      console.log('Model ready');
      setModel(model);
    })
    .catch(err => {
      console.log('err', err);
    });
  }

  useEffect(() => {
    getVideo(); // Opens camera
    backUpDataFunction(); // Loads the local copy of the database
    loadModel(); // Loads food recognition model
    setLoading(false); // Stops spinner
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef]);

  const takePhoto = () => {
    // This function snaps a photo when button in clicked

    setHasPhoto(false);
    setHasFood(false);
    
    const width = cte.width;
    const height = cte.height;

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext('2d');
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    ctx.drawImage(video, 0, 0, width, height);
    setHasPhoto(true);
  }

  const runModel = () => {
    // This function runs the food recognition model once there is a photo

    // Returns: A string for the dish name with highest probability

    setLoading(true);

    let photo = photoRef.current;
    let ctx = photo.getContext('2d');

    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
    const { data, width, height } = imageData;

    // data processing
    // see https://github.com/fchollet/keras/blob/master/keras/applications/imagenet_utils.py
    // and https://github.com/fchollet/keras/blob/master/keras/applications/inception_v3.py
    let dataTensor = ndarray(new Float32Array(data), [ width, height, 4 ]);
    let dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [
      width,
      height,
      3
    ]);
    ops.divseq(dataTensor, 255);
    ops.subseq(dataTensor, 0.5);
    ops.mulseq(dataTensor, 2);
    ops.assign(
      dataProcessedTensor.pick(null, null, 0),
      dataTensor.pick(null, null, 0)
    );
    ops.assign(
      dataProcessedTensor.pick(null, null, 1),
      dataTensor.pick(null, null, 1)
    );
    ops.assign(
      dataProcessedTensor.pick(null, null, 2),
      dataTensor.pick(null, null, 2)
    );

    const inputData = { input_1: dataProcessedTensor.data };
    const predPromise = model.predict(inputData);

    setFoodPred(predPromise.then(outputData => {
      const preds = outputData['dense_1'];
      const bestpred = food101topK(preds)[0].name; // Sort the result by probability
      setFoodPred(bestpred);
      setHasFood(true);
      setLoading(false); // Stops spinner
      return bestpred
    }));
  }

  const sendAndClosePhoto = () => {
    // This function starts the food recognition process and clear the photo

    runModel();

    // let photo = photoRef.current;
    // let ctx = photo.getContext('2d');
    // ctx.clearRect(0,0,photo.width, photo.height);
    // setHasPhoto(false);
  }

  const backUpDataFunction = () => {
    // This function loads the local copy of the database

    // Returns: A JSON object with the nutritional information

    setBackUpData(data.map((data) => {
      return data
    }))
  }

  return (
    <div>
      <Row className='justify-content-center mb-5'>
        <Col md={8} lg={6}>
          <h2 className='h5 mb-3'>First, please take a picture of your food</h2>
          <div>
            <div className='cameraElement' style={ !hasPhoto ? {display:'block'} : {display:'none'}}>
              <video ref={videoRef}></video>
            </div>
            <div className='photoElement' style={ hasPhoto ? {display:'block'} : {display:'none'}}>
              <canvas ref={photoRef}></canvas>
            </div>
            <div className='d-flex justify-content-center mt-2'>
              <Button variant="outline-dark" className="d-flex align-items-center" onClick={takePhoto}>
                {hasPhoto ? <TbRepeat className='me-2'/> : <FiCamera className='me-2'/>}
                <span>{hasPhoto ? "New Picture" : "Take Picture"}</span>
              </Button>
              {hasPhoto &&
                <Button variant="outline-dark" className="d-flex align-items-center ms-2" onClick={sendAndClosePhoto}>
                  <MdOutlineSendToMobile className='me-2'/>
                  Confirm to analyze
                </Button>
              }
            </div>
          </div>
          
          {loading &&
            <div className='d-flex justify-content-center py-5'>
              <Spinner />
            </div>
          }
        </Col>
      </Row>

      {hasFood && foodpred &&
        <Row className='justify-content-center'>
          <Col md={8} lg={6}>
            <h2 className='h5 mb-3'>Here's your food information</h2>
            <div className='foodContainer'>
              <FoodInfo backUpData={backUpData} food={foodpred} />
            </div>
          </Col>
        </Row>
      }
    </div>
  )
}