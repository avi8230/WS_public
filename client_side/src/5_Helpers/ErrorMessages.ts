import notify from "./NotifyMessages";

function errorMessages(error: any): void {
    if (error.response) {
        // return `error.response.data : ${error.response.data}\n
        //         error.response.status : ${error.response.status}\n
        //         error.response.headers : ${error.response.headers}`;

        // notify.error(`error.response.data : ${error.response.data}`);
        // notify.error(`error.response.status : ${error.response.status}`);
        // notify.error(`error.response.headers : ${error.response.headers}`);

        notify.error(error.response.data);
    }
    else if (error.request) {
        // return `error.request : ${error.request}`;
        notify.error(`error.request : ${error.request}`);
    }
    else {
        // return `Any error : ${error.message}`;
        notify.error(`Any error : ${error.message}`);
    }
}

export default errorMessages;