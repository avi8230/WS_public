import { action, makeObservable, observable, runInAction } from "mobx";
import UserModel from "../1_Models/UserModel";
import CredentialsModel from "../1_Models/CredentialsModel";
import user_WebAccess from "../2_WebAccess/User_webAccess";
import jwtDecode from "jwt-decode";
import preferences_localMemory from "./Preferences_localMemory";
import words_localMemory from "./Words_localMemory";

export class User_localMemory {

    @observable
    public token: string = null;

    @observable
    public user: UserModel = null;

    @observable
    public reentered: boolean = false;

    public constructor() {
        makeObservable(this);

        this.token = localStorage.getItem("token");
        if (this.token) {
            const jwtPayload = jwtDecode(this.token);
            this.user = (jwtPayload as any).user;
        }
    }

    @action
    public async updateNameAndPassword(name: string, password?: string): Promise<string> {
        name = await user_WebAccess.updateNameAndPassword(name, password);
        // https://stackoverflow.com/questions/64770762/mobx-since-strict-mode-is-enabled-changing-observed-observable-values-withou
        // https://stackoverflow.com/questions/57271153/mobx-runinaction-usage-why-do-we-need-it
        // https://www.google.com/search?q=runinaction+mobx&oq=runInAction&aqs=edge.1.69i57j0i512j0i30l4j0i5i30j0i30.2391j0j1&sourceid=chrome&ie=UTF-8
        runInAction(() => {
            this.user.name = name;
        })
        return 'The details have been successfully updated!';
    }

    @action
    public async register(email: string): Promise<string> {
        const message = await user_WebAccess.register(email);
        runInAction(() => {
            const newUser = {
                id: -1,
                uuid: "",
                subscriptionId: "",
                role: -1,
                deletingWords: 100,
                name: "",
                email,
                password: ""
            }
            this.user = newUser;
        });
        return message;
    }

    @action
    public async login(credentials: CredentialsModel): Promise<string> {
        const token = await user_WebAccess.login(credentials);
        runInAction(() => {
            this.token = token;
            localStorage.setItem("token", token);

            const jwtPayload = jwtDecode(token);
            this.user = (jwtPayload as any).user;

            this.reentered = true;

            if ([0, 1, 3, 4].includes(this.user.role)) {
                preferences_localMemory.save();
                words_localMemory.save();
            }
        });
        return `Welcome ${this.user.name}!`;
    }

    @action
    public async passwordReset_stepOne(email: string): Promise<string> {
        const message = await user_WebAccess.passwordReset_stepOne(email);
        runInAction(() => {
            const newUser = {
                id: -1,
                uuid: "",
                subscriptionId: "",
                role: -2,
                deletingWords: 100,
                name: "",
                email,
                password: ""
            }
            this.user = newUser;
        });
        return message;
    }

    @action
    public async passwordReset_stepTwo(email: string, temporaryPassword: string): Promise<string> {
        const message = await user_WebAccess.passwordReset_stepTwo(email, temporaryPassword);
        runInAction(() => {
            const newUser = {
                id: -1,
                uuid: "",
                subscriptionId: "",
                role: -3,
                deletingWords: 100,
                name: "",
                email,
                password: ""
            }
            this.user = newUser;
        });
        return message;
    }

    @action
    public logout(): string {
        this.token = null;
        this.user = null;
        preferences_localMemory.preferences = null;
        words_localMemory.words = null;
        localStorage.removeItem("token");
        return `Goodbye!`
    }

    @action
    public delete(): void {
        this.user = null;
    }

    @action
    public updateNowEntered(): void {
        this.reentered = false;
    }

    @action
    public async replaceToken(): Promise<void> {
        const token = await user_WebAccess.replaceToken();
        runInAction(() => {
            this.token = token;
            localStorage.setItem("token", token);

            const jwtPayload = jwtDecode(token);
            this.user = (jwtPayload as any).user;
        });
    }
}

const user_localMemory = new User_localMemory();

export default user_localMemory;
