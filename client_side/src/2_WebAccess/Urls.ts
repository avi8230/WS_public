abstract class Urls {

    public user = {
        update: "",
        register: "",
        login: "",
        passwordReset_stepOne: "",
        passwordReset_stepTwo: "",
        replaceToken: ""
    }

    public preferences = {
        get: "",
        update: ""
    }

    public words = {
        getWords: "",
        getImage: "",
        getAudio: "",
        add: "",
        updateWord: "",
        updateScore: "",
        delete: "",
    }

    public payment = {
        createSubscription_step1: "",
        createSubscription_step2: "",
        cancelSubscription: ""
    }

    public constructor(baseUrl: string) {

        this.user = {
            update: baseUrl + "users",
            register: baseUrl + "users/register",
            login: baseUrl + "users/login",
            passwordReset_stepOne: baseUrl + "users/passwordReset/stepOne",
            passwordReset_stepTwo: baseUrl + "users/passwordReset/stepTwo",
            replaceToken: baseUrl + "users/replace-token"
        }

        this.preferences = {
            get: baseUrl + "preferences",
            update: baseUrl + "preferences"
        }

        this.words = {
            getWords: baseUrl + "words/get/words",
            getImage: baseUrl + "words/get/image/",
            getAudio: baseUrl + "words/get/audio/",
            add: baseUrl + "words/add",
            updateWord: baseUrl + "words/update/",
            updateScore: baseUrl + "words/update/score/",
            delete: baseUrl + "words/delete/"
        };

        this.payment = {
            createSubscription_step1: baseUrl + "payment/create-subscription",
            createSubscription_step2: baseUrl + "payment/create-subscription/",
            cancelSubscription: baseUrl + "payment/cancel-subscription"
        }

    }

}

class DevelopmentUrls extends Urls {
    public constructor() {
        super("http://localhost:3001/api/");
    }
}

class ProductionUrls extends Urls {
    public constructor() {
        // super("http://18.213.123.136/api/");
        super("https://wordstorage.com/api/");
    }
}

const urls = process.env.NODE_ENV === "development" ? new DevelopmentUrls() : new ProductionUrls();

export default urls;