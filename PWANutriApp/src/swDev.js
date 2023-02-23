export default function swDev()
{
    // This function starts the service workers in swUrl
    let swUrl = `${process.env.PUBLIC_URL}/sw.js`
    navigator.serviceWorker.register(swUrl).then((response)=>{
        console.warn("Service worker registered: ",response)
    });
    navigator.serviceWorker.ready.then((register)=>{
        console.warn("Service worker ready: ", register);
    })

}