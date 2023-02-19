import React, { Component } from 'react';
import './App.css';

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

  render() {
    const {
      loadingPercent,
      modelLoaded,
      modelLoading,
    } = this.state;
    return (
      <div className="Model">
        <div className='init'>
        { !modelLoaded && !modelLoading ? <button onClick={this.loadModel}>Load Model (85 MB)</button> : ''}
        </div>
      </div>
    );
  }
}

export default Model;
