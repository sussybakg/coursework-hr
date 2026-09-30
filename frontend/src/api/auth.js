import {api} from "./api.js";

export const signIn = async (username, password) => {
    const {data} = await api.post("/auth/sign-in", {
        username,
        password
    });
    return data;
};

export const signUp = async (username, email, password) => {
    const {data} = await api.post("/auth/sign-up", {
        username,
        email,
        password
    });
    return data;
};
