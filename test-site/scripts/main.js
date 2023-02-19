// let myHeading = document.querySelector('h1');
// myHeading.textContent = 'Welcome!';
// document.querySelector('html').addEventListener('click',()=>{
//     alert("别戳我，我怕疼。")
// })

let myImage = document.querySelector('img');

myImage.onclick = ()=>{
    let mySrc =myImage.getAttribute('src');
    if(mySrc === 'images/noangel.jpg') {
        myImage.setAttribute('src', 'images/tenshiwithcake.jpg');    
    } else {
        myImage.setAttribute('src','images/noangel.jpg');
    };
}

// 添加个性化欢迎信息
let myButton = document.querySelector('button');
let myHeading = document.querySelector('h1');

function setUserName() {
    let myName = prompt('User name?', 'anonymous');
    if(!myName) {
        setUserName();
    } else {
        localStorage.setItem('Username', myName);
        myHeading.textContent = 'Welcom back, ' + myName +'!';
    }
}

// 初始化
if(!localStorage.getItem('Username')) {
    setUserName();
} else {
    let storedName = localStorage.getItem('Username');
    myHeading.textContent = 'Welcom back, ' + storedName +'!';
}

myButton.onclick = function() {
    setUserName();
}