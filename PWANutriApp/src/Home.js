import React, {useRef, useEffect, useState} from 'react';
import FoodInfo from './FoodInfo';
import {TbRepeat} from 'react-icons/tb';
import {FiCamera} from 'react-icons/fi';
import {MdOutlineSendToMobile} from 'react-icons/md';


export default  function Home()
{
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false);
    const [hasFood, setHasFood] = useState(false);
    const [backUpData, setBackUpData] = useState(false);


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
        getVideo();
        backUpDataFunction();
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

    const backUpDataFunction = () => fetch('./food.json', {
        headers: 
            {'Content-Type': 'application/json','Accept': 'application/json'}
        })
        .then((response) => {
        response.json().then((result) => {
            setBackUpData(result)
        })
    })

    return (
        <div>
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