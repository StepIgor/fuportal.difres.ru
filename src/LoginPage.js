import "./CSS/LoginPage.css"
import {useState} from "react";
import {connectionString} from "./vars";

function LoginPage(props){

    let [login, editLogin] = useState()
    let [password, editPassword] = useState()

    function tryAuthentication(){
        if (login == null || login.replace(/ /g, '').length < 1){
            return
        }

        if (password == null || password.replace(/ /g, '').length < 1){
            return
        }

        fetch(`${connectionString}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: login,
                password: password
            })
        }).then((res) => res.json()).then((answer) => {
            if (answer.status == 'done') {
                localStorage['session'] = answer.session;
                props.editPage('workspace');
            } else {
                alert(answer.details);
            }
        }).catch((error) => {
            alert('Нет связи с сервером.')
        })
    }

    return (
        <div className='wrapper'>
            <div>
                <img src="logo.png" />
            </div>
            <div className="login-container">
                <div className='title'>
                    Авторизация в ЛК Руководителя
                </div>
                <div className='hor-line'>

                </div>
                <input onChange={(e)=>{editLogin(e.target.value)}} type='text' maxLength='32' placeholder='Логин' />
                <input onChange={(e) => {editPassword(e.target.value)}} type='password' maxLength='48' placeholder='Пароль' />
                <div className='button' onClick={tryAuthentication}>
                    Войти
                </div>
            </div>
        </div>
    )
}

export default LoginPage;