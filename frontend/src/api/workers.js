import {api} from "./api.js";

export const getWorkers = async () => {
    const {data} = await api.get("/workers");
    return data;
};

export const getWorker = async (id) => {
    const {data} = await api.get(`/workers/${id}`);
    return data;
};

export const createWorker = async (workerData) => {
    const {data} = await api.post("/workers", workerData);
    return data;
};

export const createSelfWorker = async (workerData) => {
    const {data} = await api.post("/workers/self", workerData);
    return data;
};

export const updateWorker = async (id, newWorkerData) => {
    if (id == null) {
        throw new Error("Необходимо указать ID Worker");
    }
    const workerId = Number(id);
    if (isNaN(workerId)) {
        throw new Error(`Неверный ID Worker: ${id}`);
    }
    const {data} = await api.put(`/workers/${workerId}`, newWorkerData);
    return data;
};

export const deleteWorker = async (id) => {
    const {data} = await api.delete(`/workers/${id}`);
    return data;
};

export const uploadAvatar = async (id, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const {data} = await api.post(`/workers/${id}/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return data;
};

export const getHistory = async () => {
    const {data} = await api.get("/workers/history");
    return data;
};

export const getStats = async () => {
    const {data} = await api.get("/workers/stats");
    return data;
};