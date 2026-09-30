import {BrowserRouter as Router} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";
import './index.css';
import {ModalProvider} from "./Components/ModalProvider/ModalProvider.jsx";
import AppContent from "./AppContent.jsx";

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <div className="app">
                    <ModalProvider>
                        <AppContent/>
                    </ModalProvider>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;
