import {createContext, useContext, useState} from "react";

export const ModalContext = createContext(undefined);

export const ModalProvider = ({children}) => {
    const [modalType, setModalType] = useState(null);
    const [modalProps, setModalProps] = useState({});

    const openModal = (type, props = {}) => {
        setModalType(type);
        setModalProps(props);
    };

    const closeModal = () => {
        setModalType(null);
        setModalProps({});
    };

    return (
        <ModalContext.Provider value={{modalType, modalProps, openModal, closeModal}}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
