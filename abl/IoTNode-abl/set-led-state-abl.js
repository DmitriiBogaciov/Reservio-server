const Client = require("azure-iothub").Client;
const Message = require("azure-iot-common").Message;

async function SetLedState(targetDevice, state){
    const connectionString = "HostName=ReservioIoT.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=diWJ8Cbo/YMeuTMFXC+MucXifzsQY7cjlAIoTNTXNBA=";
    const serviceClient = Client.fromConnectionString(connectionString);

    try {
        await serviceClient.open();
        console.log('Client connected');

        console.log(state)

        dtoin = {
            ...state,
            topic: "node/demo:0/led/-/state/set"
        }

        const data = JSON.stringify(dtoin);
        const message = new Message(data);
        console.log('Sending message: ' + message.getData());

        serviceClient.send(targetDevice, message, function (err, res) {
            if (err) {
                console.error('Send error: ' + err.toString());
            } else {
                console.log('Send status: ' + res.constructor.name);
            }
        });
    } catch (error) {
        error.message = "Problems with sending";
        throw error;
    }
}

module.exports = SetLedState;
