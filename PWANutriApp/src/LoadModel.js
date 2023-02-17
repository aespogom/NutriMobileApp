import React, { Component } from 'react';
import './App.css';

import ndarray from 'ndarray';
import ops from 'ndarray-ops';

import { food101topK } from './utils';

const loadImage = window.loadImage;

const mapProb = (prob) => {
  if (prob * 100 < 2) {
    return '2%';
  } else {
    return (prob * 100 + '%');
  }
}

const Predictions = ({topK}) => {
  return (
    <table className='predictions'>
      <tbody>
      <tr>
        <th className='th'>Prediction</th>
        <th>Probability</th>
      </tr>
      { topK.map((pred, i) =>
        <tr key={i}>
          <td className='predLabel'>{pred.name}</td>
          <td className='predPercent'>
            <span className='predPercentLabel'>{(pred.probability*100).toFixed(5)}%</span>
            <div className='predBar' style={{width: mapProb(pred.probability)}}/>
          </td>
        </tr>
      )}
      </tbody>
    </table>
  );
}

class Model extends Component {

  constructor() {
    super();

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

    this.urlInput = null;
    this.state = {
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
  }

  loadModel = () => {
    console.log('Loading Model');
    const model = new window.KerasJS.Model({
      filepaths: {
        model: 'model.json' ,
        weights: 'model4b.10-0.68_weights.buf',
        metadata: 'model4b.10-0.68_metadata.json'
      },
      gpu: this.state.hasWebgl,
      layerCallPauses: true
    });

    let interval = setInterval(() => {
      const percent = model.getLoadingProgress();
      console.log('Progress', percent, model.xhrProgress);
      this.setState({
        loadingPercent: percent
      });
    }, 100);

    const waitTillReady = model.ready();

    waitTillReady.then(() => {
      clearInterval(interval);
      console.log('Model ready');
      this.setState({
        loadingPercent: 100,
        modelLoading: false,
        modelLoaded: true
      });

    })
    .catch(err => {
      clearInterval(interval);
      console.log('err', err);
    });

    this.setState({
      modelLoading: true,
      model
    });
  }

  loadImageToCanvas = (url) => {
    console.log('Loading Image');
    if (!url) {
      return;
    };

    this.setState({
      imageLoadingError: false,
      imageLoading: true,
      loadingPercent: 0,
      classifyPercent: 0,
      topK: null
    });

    loadImage(
      // 'http://crossorigin.me/' + url,
      url,
      img => {
        if (img.type === 'error') {
          console.log('Error loading image');
          this.setState({
            imageLoadingError: true,
            imageLoading: false,
            modelRunning: false,
            url: null
          });

        } else {
          console.log('Image Loaded');
          const ctx = document.getElementById('input-canvas').getContext('2d');
          ctx.drawImage(img, 0, 0);
          this.setState({
            imageLoadingError: false,
            imageLoading: false,
            modelRunning: true
          });
          setTimeout(() => {
            this.runModel();
          }, 1000)
        }
      },
      {
        maxWidth: 299,
        maxHeight: 299,
        cover: true,
        crop: true,
        canvas: true,
        crossOrigin: 'Anonymous'
      }
    );
  }

  runModel = () => {
    console.log('Running Model');

    const ctx = document.getElementById('input-canvas').getContext('2d');
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
    const predPromise = this.state.model.predict(inputData);

    const totalLayers = Object.keys(this.state.model.modelDAG).length
    let interval = setInterval(() => {
      const completedLayers = this.state.model.layersWithResults.length;
      this.setState({
        classifyPercent: ((completedLayers / totalLayers) * 100).toFixed(2)
      });
    }, 50);

    predPromise.then(outputData => {
      console.log(outputData);
      clearInterval(interval);
      const preds = outputData['dense_1'];
      const topK = food101topK(preds);
      console.log(topK);
      this.setState({
        topK,
        modelRunning: false
      });
    });
  }

  classifyNewImage = () => {
    const newUrl = this.urlInput.value;
    this.setState({
      url: this.urlInput.value
    });
    console.log('classifying new image', newUrl);
    this.loadImageToCanvas(newUrl);
  }

  render() {
    const {
      loadingPercent,
      modelLoaded,
      modelLoading,
      modelRunning,
      imageLoading,
      imageLoadingError,
      classifyPercent,
      topK
    } = this.state;
    return (
      <div className="Model">
        <div className='init'>
        { !modelLoaded && !modelLoading ? <button onClick={this.loadModel}>Load Model (85 MB)</button> : ''}
        { !modelLoaded && modelLoading ?
          <p className='loading'>LOADING MODEL: {loadingPercent}%</p>
          : ''}
        </div>
      </div>
    );
  }
}

export default Model;
