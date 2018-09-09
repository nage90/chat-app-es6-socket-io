const SERVER_URL = "http://185.13.90.140:8081/";
class Client {

    constructor () {

        this.initSocketConnection();
        this.addEventListeners();

    }

    initSocketConnection(){

        this.socket = io.connect(SERVER_URL);
        this.socket.on('message', (data) => {
            this.appendMessageToList(data);
        });
    }

    appendMessageToList(data){

        let messageListContainer = document.getElementsByClassName("message-list")[0];
        let messageDiv = document.createElement("div");
        let isMyMessage = data.user === 'echoBot2000';
        messageDiv.classList = isMyMessage ? "message sent-message" : "message received-message";

        let contentNode = null;
        if(isMyMessage){
            contentNode = document.createTextNode(this.messageValue);
            this.clearMessageAfterSuccessFullSent();
        }else{
            contentNode = document.createTextNode(data.user + ": " + data.message);
        }

        messageDiv.appendChild(contentNode);
        messageListContainer.appendChild(messageDiv);
    }

    addEventListeners() {

        let button = document.getElementById("send-button");
        let messageInput = document.getElementById("message");

        button.addEventListener("click", () => {
            this.sendMessage();
        })

        messageInput.addEventListener("keyup", () => {
            event.preventDefault();
            if (event.keyCode === 13) {
                this.sendMessage();
            }
        });
    }

    sendMessage() {

        let nameInput = document.getElementById("name");
        let messageInput = document.getElementById("message");

        this.nameValue = nameInput.value;
        this.messageValue = messageInput.value;

        nameInput.classList = !this.nameValue ? "name missing" : "name";
        messageInput.classList = !this.messageValue ? "message missing" : "message";

        if (!this.nameValue || !this.messageValue) {
           return;
        }

        this.socket.emit('message', {
            message: this.messageValue,
            user: this.nameValue
        });
    }

    clearMessageAfterSuccessFullSent(){
        document.getElementById("message").value = "";
        this.messageValue = null;
    }

}

window.onload = () => {
    new Client();
};