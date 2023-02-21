export default function swDev()
{
    let swUrl = `${process.env.PUBLIC_URL}/sw.js`
    console.log(swUrl);
    navigator.serviceWorker.register(swUrl).then((response)=>{
        console.warn("Service worker registered: ",response)
    });
    navigator.serviceWorker.ready.then((register)=>{
        console.warn("Service worker ready: ", register);
        // // Check if the user has an existing subscription
        // return register.pushManager.getSubscription()
        //     .then(() => {
        //         console.log('inside subs')
        //         const vapidPublicKey = "BFb40buPpVvinr6wSgdT0Lv4yTqOsdjyK6QbRbDQrCVaT2XZOw5qM4mC1DhRoCTGgmMN8Ye3WpqU0wNTNhlwmng";
        //         return register.pushManager.subscribe({
        //             userVisibleOnly: true,
        //             applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        //         });
        //     });

    })

    // // Utility function for browser interoperability
    // function urlBase64ToUint8Array(base64String) {
    //     var padding = '='.repeat((4 - base64String.length % 4) % 4);
    //     var base64 = (base64String + padding)
    //         .replace(/\-/g, '+')
    //         .replace(/_/g, '/');

    //     var rawData = window.atob(base64);
    //     var outputArray = new Uint8Array(rawData.length);

    //     for (var i = 0; i < rawData.length; ++i) {
    //         outputArray[i] = rawData.charCodeAt(i);
    //     }
    //     return outputArray;
    // }
}