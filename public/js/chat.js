var socket = io.connect("/");

var msgInp = document.querySelector("#msgInp");
var sendBtn = document.querySelector("#sendBtn");
var output = document.querySelector("#output");
var users = document.querySelector("#users");

var userID = "";
socket.on("connect", () => {
    userID = socket.id;
});

const send = () => {
    socket.emit('chat', {
        message: msgInp.value,
        handle: userID
    });
    return msgInp.value = '';
};

msgInp.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        send();
    }
});

sendBtn.addEventListener("click", () => {
    send();
});

socket.on('chat', (data) => {
    if (data.handle == 'server') {
        users.innerHTML = '<div class="bg-green-400 px-2 py-0.5 inline rounded-full ">' + data.message + '</div>';
    }
    else if (data.handle == userID) {
        output.innerHTML += `<div  class=" block my-2  text-right " style="margin-left: 50%;">
        <div class="inline-block px-2 py-1 border-r-4  border-blue-500 bg-gray-200">${data.message}</div>
    </div>`;

    }
    else {
        output.innerHTML += `    <div  class=" block my-2 " style="width: 50%;">
        <div class="inline-block px-2 py-1 border-l-4  border-green-500 bg-gray-200">${data.message}</div>
    </div>`;
    }
    output.scrollTop = output.scrollHeight + 200;


});