const socket = io('http://localhost:8080');

function openStream() {
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    console.log(stream);
    video.srcObject = stream;
    video.play();
}

// openStream()
// .then(stream => playStream('localStream', stream));

const peer = new Peer({key: 'peerjs'});

peer.on('open', id => {
	$("#my-peer").val(id);
	$("#my-peer").html(id);
});

//Caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream().then(stream => {
        playStream('localStream', stream)
        const call = peer.call(id, stream)
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

//Callee
peer.on('call', call => {
    openStream().then(stream => {
        call.answer(stream)
        playStream('localStream', stream)
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

//MAIN
$("#chat").hide();

socket.on('login', function(data){
	(data.status == 'success') ? $("#chat").show() && $("#login").hide() : alert("Login false !")
});

$("#btnLogin").click(() => {
	socket.emit('login', {username: $("#username").val(), peerID: $("#my-peer").val()});
});