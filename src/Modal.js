import "./CSS/Modal.css"
import {useEffect, useState} from "react";
import {Fade} from "react-reveal";
import {connectionString} from "./vars";

function Modal(props) {

    let [modalContent, editModalContent] = useState()
    let [lastAbout, editLastAbout] = useState()
    let [lastId, editLastId] = useState();

    useEffect(() => {
        if (props.visible == false) return;
        if (lastAbout == props.about && lastId == props.id) return;
        if (props.about == 'user') {
            editLastAbout('user');
            fetch(`${connectionString}/getUserInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session: localStorage['session']
                })
            }).then(res => res.json()).then(answer => {
                if (answer.status == 'done') {
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
        } else if (props.about == 'employee') {
            editLastAbout('employee');
            editLastId(props.id);
            fetch(`${connectionString}/getEmployeeInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session: localStorage['session'],
                    id: props.id
                })
            }).then(res => res.json()).then(answer => {
                if (answer.status == 'done') {
                    editModalContent(<div className={`modal-content`}>
                        <div className={`modal-content-row`}>
                            <div>
                                ФИО:
                            </div>
                            <div>
                                {answer.emp.surname} {answer.emp.name} {answer.emp.patron}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Структурное подразделение:
                            </div>
                            <div>
                                {answer.emp.dname} ({answer.emp.fname})
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Должность:
                            </div>
                            <div>
                                {answer.emp.pname}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Дата рождения:
                            </div>
                            <div>
                                {new Date(answer.emp.birthdate).toLocaleDateString()}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Возраст:
                            </div>
                            <div>
                                {Math.floor((new Date() - new Date(answer.emp.birthdate)) / (1000 * 60 * 60 * 24 * 365))}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Ученое звание:
                            </div>
                            <div>
                                {answer.emp.aname}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Образование:
                            </div>
                            <div>
                                {answer.emp.einame}
                            </div>
                        </div>
                        <div className={`modal-block`}>
                            <div>
                                Повышение квалификации:
                            </div>
                            <div>
                                <table>
                                    <thead>
                                    <tr>
                                        <td>
                                            Название заведения
                                        </td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>
                                            {answer.emp.qual_up}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>);
                } else {
                    editModalContent(<div className={`modal-content`}>
                        {answer.details}
                    </div>);
                }
            }).catch(error => {
                alert('Нет связи с сервером')
            })
        }
    })

    return (
        <Fade>
            <div className={`modal-wrapper ${props.visible ? 'visible' : ''}`} onClick={(e) => {
                props.editVisible(false)
            }}>
                <div className='modal-window' onClick={(e) => {
                    e.stopPropagation()
                }}>
                    <div className={`modal-title`}>
                        <div>
                            Информация
                            о {props.about == 'user' ? 'пользователе' : props.about == 'student' ? 'студенте' : 'сотруднике'}
                        </div>
                        <div onClick={() => {
                            props.editVisible(false)
                        }}>
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