import "./CSS/Modal.css"
import {useEffect, useState} from "react";
import {Fade} from "react-reveal";
import {connectionString} from "./vars";

function Modal(props){

    let [modalContent, editModalContent] = useState()

    useEffect(() => {
        if (props.visible == false || modalContent != null) return;
        if (props.about == 'user'){
            fetch(`${connectionString}/getUserInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session: localStorage['session']
                })
            }).then(res => res.json()).then(answer => {
                if (answer.status == 'done'){
                    editModalContent(<div className={`modal-content`}>
                        <div className={`modal-content-row`}>
                            <div>
                                ФИО:
                            </div>
                            <div>
                                {answer.surname} {answer.name} {answer.patron}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Логин:
                            </div>
                            <div>
                                {answer.login}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Факультет:
                            </div>
                            <div>
                                {answer.fac == null ? '(нет)' : answer.fac}
                            </div>
                        </div>
                    </div>);
                } else {
                    localStorage['session'] = 'none'
                    editModalContent(<div className={`modal-content`}>
                        Не выполнен вход в аккаунт
                    </div>);
                }
            }).catch(error => {
                alert('Нет связи с сервером')
            })
        }
    })

    return (
        <Fade>
            <div className={`modal-wrapper ${props.visible ? 'visible' : ''}`} onClick={(e) => {props.editVisible(false)}}>
                <div className='modal-window' onClick={(e) => {e.stopPropagation()}}>
                    <div className={`modal-title`}>
                        <div>
                            Информация о {props.about == 'user' ? 'пользователе' : props.about == 'student' ? 'студенте' : 'сотруднике'}
                        </div>
                        <div onClick={() => {props.editVisible(false)}}>
                            <i className={`material-icons modal-close-but`}>close</i>
                        </div>
                    </div>
                    <div className={`hor-line-full`}>
                    </div>
                    {modalContent && modalContent}
                </div>
            </div>
        </Fade>
    )
}

export default Modal