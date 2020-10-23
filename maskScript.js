chrome.storage.sync.get(['nithinMaskObject'], function(result){
    name = result['nithinMaskObject']['name'];
    email = result['nithinMaskObject']['email'];
    console.log(name,email);
})

var nithinMaskObject2 = {};
let classifier;
var danger;
var duration;
var sent = false;
// let imageModelURL = 'https://teachablemachine.withgoogle.com/models/5RZmYaOzZ/';
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/KAtXyi88Q/';

let video;
let flippedVideo;
let label = "";

function preload() {
classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
createCanvas(0, 0);
video = createCapture(VIDEO);
video.size(320, 240);
video.hide();
console.log(video);
flippedVideo = ml5.flipImage(video);
classifyVideo();

var alertBox = document.createElement("div");
alertBox.setAttribute("class","alertBox")
alertBox.style.cssText="background-color: rgb(233, 39, 39);padding: 10px 20px;color: white;font-size: 20px; z-index: 9000000000; position: fixed; bottom: 4%; border-radius: 7px; font-family: Verdana, Geneva, Tahoma, sans-serif; left: 2%"
alertBox.innerHTML = "You have removed your mask for <span class=\"nt\"></span> seconds. Please wear it back";
document.body.appendChild(alertBox);
var blockBox = document.createElement("div");
blockBox.setAttribute("class","blockBox")
blockBox.style.cssText="z-index: 8000000000; position: fixed; top: 0%; left: 0%; width: 100vw; height: 100vh; background-color: black; "
document.body.appendChild(blockBox);
document.querySelector('.alertBox').style.display="none";
document.querySelector('.blockBox').style.display="none";
nt=1;
}

function draw() {
admin="0"
}

function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
    flippedVideo.remove();
}

var oldLabel=""
var t0;
var t1;
var totalTime=0;
var thisTime=0;


function gotResult(error, results) {
if (error) {
    console.error(error);
    return;
}

label = results[0].label;
if(label=="No mask"){
    document.querySelector('.alertBox').style.display="block";
    if(oldLabel=="No mask"){
    t1 = performance.now()
    thisTime = Math.round(((t1-t0)/1000)*1);
    document.querySelector('.nt').innerHTML=thisTime;
        if(thisTime==300){
            sendMail(thisTime,"low");
        }
        else if(thisTime==600){
            sendMail(thisTime,"medium")
        }
        else if(thisTime==600){
            sendMail(thisTime,"high")
        }
        else if(thisTime==9){
            if(!sent){
                sent = true
                setTimeout(() => {
                    sendMail(thisTime,"Very high")
                    document.querySelector('.blockBox').style.display="block";
                    sent = false;
                }, 1500);
            }
        }
    }else{
    oldLabel="No mask";
    t0 = performance.now()
    }
}else{
    if(oldLabel=="No mask"){
        document.querySelector('.blockBox').style.display="none";
        totalTime+=thisTime
        nithinMaskObject2["time"]=totalTime;
        chrome.storage.sync.set({
            nithinMaskObject2
        }, function() {
            console.log(nithinMaskObject2);
        });
    }
    oldLabel="Mask";
    document.querySelector('.alertBox').style.display="none";
}
if(video.loadedmetadata){
    classifyVideo();
}else{
    document.querySelector('.alertBox').style.display="none";
}
}

function sendMail(thisTime,danger){
    var d = new Date();
    var data = new FormData();
    data.append("email", email);
    data.append("name", name);
    data.append("duration", thisTime);
    data.append("time", d);
    data.append("danger", danger);

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
        console.log(this.responseText);
    }
    });

    xhr.open("POST", "https://nithins.me/nbot/mask/mail.php");

    xhr.send(data);
}

function block(){
    document.querySelector('.blockBox').style.display="block";
}
function unblock(){
    document.querySelector('.blockBox').style.display="none";
}