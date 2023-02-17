import React, {useRef, useEffect, useState, setState} from 'react';
import FoodInfo from './FoodInfo';
import {TbRepeat} from 'react-icons/tb';
import {FiCamera} from 'react-icons/fi';
import {MdOutlineSendToMobile} from 'react-icons/md';
import ndarray from 'ndarray';
import ops from 'ndarray-ops';
import { food101topK } from './utils';

export default  function Home()
{
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

    let urlInput = null;
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

    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false);
    const [hasFood, setHasFood] = useState(false);
    const [model, setModel] = useState(false);


    const getVideo = () => {
        navigator.mediaDevices
        .getUserMedia({
            video: {width: 1920, height: 1080}
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
    
        let interval = setInterval(() => {
          const percent = model.getLoadingProgress();
          console.log('Progress', percent, model.xhrProgress);
        }, 100);
    
        const waitTillReady = model.ready();

        waitTillReady.then(() => {
          clearInterval(interval);
          console.log('Model ready');
          setModel(model);
        })
        .catch(err => {
          clearInterval(interval);
          console.log('err', err);
        });
      }

    useEffect(() => {
        getVideo();
        loadModel();
    }, [videoRef]);

    const takePhoto = () => {
        setHasPhoto(false);
        setHasFood(false);
        
        const width = 299;
        const height = 299;

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext('2d');
        ctx.clearRect(0, 0, ctx.width,ctx.height);
        ctx.drawImage(video, 0, 0, width, height);
        setHasPhoto(true);
    }

    const runModel = () => {
        console.log('Running Model');
    
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
    
        predPromise.then(outputData => {
          console.log(outputData);
          const preds = outputData['dense_1'];
          const topK = food101topK(preds);
          console.log(topK);
        });
      }

    const sendAndClosePhoto = () => {
        runModel();
        let photo = photoRef.current;
        let ctx = photo.getContext('2d');
        ctx.clearRect(0,0,photo.width, photo.height);

        setHasPhoto(false);
        setHasFood(true);
    }

    return (
        <div>
            <div className='foodContainer'>
                {hasFood ? <FoodInfo /> : null}
            </div>
            <div className={'cameraElement ' + (hasPhoto ? '' : ' center')}>
                <video ref={videoRef}></video>
                <button id="buttonSnap" onClick={takePhoto}>
                    {hasPhoto ? <TbRepeat/> : <FiCamera/>}
                </button>
            </div>
            <div id='photoElement' className={'cameraElement result' + (hasPhoto ? ' hasPhoto' : '')}>
                <canvas ref={photoRef}></canvas>
                <button onClick={sendAndClosePhoto} style={ hasPhoto ? {display:'block'} : {display:'none'}} ><MdOutlineSendToMobile/></button>
                
            </div>
            <div className='foodContainer'>
                {hasFood ? <FoodInfo /> : null}
            </div>
        </div>
    )
}