import '../MessageWrapper.css';
import {CiCircleAlert} from "react-icons/ci";

const ErrorMessage = ({message}) => {
    return (
        <div className='wrapper'>
            <CiCircleAlert size={100} color={'#ff7070'}/>
            <p style={{fontSize: "30px"}}>ОШИБКА ЗАГРУЗКИ</p>
            <p>{message}</p>
        </div>
    );
};

export default ErrorMessage;
