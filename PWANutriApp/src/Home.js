import React, {useRef, useEffect, useState} from 'react'
import FoodInfo from './FoodInfo';



export default  function Home()
{
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false);
    const [hasFood, setHasFood] = useState(false);


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

    useEffect(() => {
        getVideo()
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
        document.getElementById('buttonSnap').innerHTML='Retake';
    }

    const sendAndClosePhoto = () => {
        let photo = photoRef.current;
        let ctx = photo.getContext('2d');
        ctx.clearRect(0,0,photo.width, photo.height);

        setHasPhoto(false);
        document.getElementById('buttonSnap').innerHTML='SNAP!';
        setHasFood(true);
    }

    return (
        <div>
            <div id='cameraElement'>
                <video ref={videoRef}></video>
                <button id="buttonSnap" onClick={takePhoto}>SNAP!</button>
            </div>
            <div id='photoElement' className={'result' + (hasPhoto ? ' hasPhoto' : '')}>
                <canvas ref={photoRef}></canvas>
                <button onClick={sendAndClosePhoto} style={ hasPhoto ? {display:'block'} : {display:'none'}} >SEND!</button>
                {hasFood ? <FoodInfo /> : null}
            </div>
        </div>
    )
}