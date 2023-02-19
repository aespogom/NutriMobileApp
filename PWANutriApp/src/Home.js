import React, {useRef, useEffect, useState} from 'react';
import FoodInfo from './FoodInfo';
import {TbRepeat} from 'react-icons/tb';
import {FiCamera} from 'react-icons/fi';
import {MdOutlineSendToMobile} from 'react-icons/md';
import Spinner from './Spinner';

export default  function Home()
{
    // Let var and const var --> let variables can change the value but constant dont
    // UseState is a function that creates a constant and a function related to each other
    // the function updates the value of the constant
    // constants defined here will be available to any other function in the script
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false);
    const [hasFood, setHasFood] = useState(false);
    const [backUpData, setBackUpData] = useState(false);
    const [loading, setLoading] = useState(false);

    // Ask for camera permissions and displays the video in the screen
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

    // This is executed when the component is created for the first time
    // The first thing that is going to be done when rendering the component
    useEffect(() => {
        setLoading(true);
        getVideo();
        backUpDataFunction();
        setLoading(false);
    }, [videoRef]);

    const takePhoto = () => {
        setHasPhoto(false);
        setHasFood(false);
        
        const width = 414;
        const height = width / (16/9);

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext('2d');
        ctx.clearRect(0, 0, ctx.width,ctx.height);
        ctx.drawImage(video, 0, 0, width, height);
        setHasPhoto(true);
    }

    const sendAndClosePhoto = () => {
        let photo = photoRef.current;
        let ctx = photo.getContext('2d');
        ctx.clearRect(0,0,photo.width, photo.height);

        setHasPhoto(false);
        setHasFood(true);
    }

    // We are requesting the local food info and storage in a global constant
    const backUpDataFunction = () => fetch('./food.json', {
        headers: 
            {'Content-Type': 'application/json','Accept': 'application/json'}
        })
        .then((response) => {
            response.json().then((result) => {
                setBackUpData(result);
            })
    })

    return (
        <div>
            {loading &&
                <Spinner />
            }
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
                {hasFood ? <FoodInfo backUpData={backUpData} /> : null}
            </div>
        </div>
    )
}