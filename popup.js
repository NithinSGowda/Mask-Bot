var nithinMaskObject = {};

document.querySelector('.update').addEventListener("click",()=>{
    var email = document.querySelector('.betaEmail').value;
    var name = document.querySelector('.sysName').value;

    document.querySelector('.first').style.display='none';
    document.querySelector('.success').style.display='block';

    nithinMaskObject["name"]=name;
    nithinMaskObject["email"]=email;

    chrome.storage.sync.set({
        nithinMaskObject
    }, function() {
        console.log(nithinMaskObject);
    });

    var data = new FormData();
    data.append("email", email);
    data.append("name", name.replace(/\'/g, "\'\'"));

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
        console.log(this.responseText);
    }
    });

    xhr.open("POST", "https://nithins.me/nbot/mask/maskAlert.php");

    xhr.send(data);
})