import "./CSS/Modal.css"
import {useEffect, useState} from "react";
import {Fade} from "react-reveal";
import {connectionString} from "./vars";
import DoughnutChart from "./WS_Subpages/DoughnutChart";
import TableGroupByComponent from "./WS_Subpages/TableGroupByComponent";

function Modal(props) {

    let [modalContent, editModalContent] = useState()
    let [filterStartDate, editFilterStartDate] = useState((new Date().toISOString().split('T')[0].split('-')[0] - 2) + '-01-01');
    let [filterEndDate, editFilterEndDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (props.about == 'user') {
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
                        <div className={`modal-block`}>
                            <div>
                                Статистика выставляемых оценок:
                            </div>
                            <div className={`modal-date-filter-container`}>
                                <div>
                                    <span>С</span>
                                    <input type="date" onChange={(e) => {
                                        editFilterStartDate(e.target.value);
                                    }} value={filterStartDate}/>
                                    <span>по</span>
                                    <input type="date" onChange={(e) => {
                                        editFilterEndDate(e.target.value);
                                    }} value={filterEndDate}/>
                                </div>
                                <div>
                                    <span>По семестрам:</span>
                                    <i className={`material-icons`} onClick={() => {
                                        if (Number.parseInt(filterEndDate.split('-')[1]) >= 2 && Number.parseInt(filterEndDate.split('-')[1]) <= 8) {
                                            editFilterEndDate(filterEndDate.split('-')[0] + '-01-31');
                                            editFilterStartDate((filterEndDate.split('-')[0] - 1) + '-09-01');
                                        } else {
                                            editFilterEndDate((filterEndDate.split('-')[0] - 1) + '-08-31');
                                            editFilterStartDate((filterEndDate.split('-')[0] - 1) + '-02-01');
                                        }
                                    }}>navigate_before</i>
                                    <i className={`material-icons`} onClick={() => {
                                        if (Number.parseInt(filterEndDate.split('-')[1]) >= 2 && Number.parseInt(filterEndDate.split('-')[1]) <= 8) {
                                            editFilterEndDate((Number.parseInt(filterEndDate.split('-')[0]) + 1) + '-01-31');
                                            editFilterStartDate(filterEndDate.split('-')[0] + '-09-01');
                                        } else {
                                            editFilterEndDate(filterEndDate.split('-')[0] + '-08-31');
                                            editFilterStartDate(filterEndDate.split('-')[0] + '-02-01');
                                        }
                                    }}>navigate_next</i>
                                </div>
                            </div>
                            <div className={`modal-chart-and-table`}>
                                <DoughnutChart key={Math.random()} about='employee' id={props.id} startDate={filterStartDate}
                                               endDate={filterEndDate}/>
                                <div>
                                    <TableGroupByComponent key={Math.random()} about="employee" id={props.id} startDate={filterStartDate}
                                                           endDate={filterEndDate}/>
                                </div>
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
    }, [filterStartDate, filterEndDate])

    return (
        <Fade>
            <div className={`modal-wrapper visible`} onClick={(e) => {
                props.editVisible(false);
                editFilterStartDate((new Date().toISOString().split('T')[0].split('-')[0] - 2) + '-01-01');
                editFilterEndDate(new Date().toISOString().split('T')[0]);
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
                            props.editVisible(false);
                            editFilterStartDate((new Date().toISOString().split('T')[0].split('-')[0] - 2) + '-01-01');
                            editFilterEndDate(new Date().toISOString().split('T')[0]);
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