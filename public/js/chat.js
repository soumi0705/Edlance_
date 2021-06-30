var socket = io.connect("http://localhost:5000")

var msgInp = document.querySelector("#msgInp")
var sendBtn = document.querySelector("#sendBtn")
var output = document.querySelector("#output")
var users = document.querySelector("#users")


const send=()=>{
    socket.emit('chat',{
        message : msgInp.value,
        handle: 'You'
    })
    return msgInp.value=''
}

msgInp.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
        send();
    }
})

sendBtn.addEventListener("click",()=>{
    send();
})

socket.on('chat',(data)=>{
    if(data.handle == 'server'){
        users.innerHTML= '<div class="bg-green-400 px-2 py-0.5 inline rounded-full ">'+ data.message+ '</div>'
    }
    else{

        output.innerHTML+='<div  class="bg-gray-200 px-2 my-2 border-l-4 border-green-500">'+ data.message +'</div>'
        output.scrollTop=output.scrollHeight+200
    }

            
})