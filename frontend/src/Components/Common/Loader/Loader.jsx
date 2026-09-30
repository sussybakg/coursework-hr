import {TailSpin} from "react-loader-spinner";
import '../MessageWrapper.css';

const Loader = () => {
    return (
        <div className='wrapper'>
            <TailSpin color={'#6d9bff'}/>
            <p>Загрузка...</p>
        </div>
    );
};

export default Loader;
