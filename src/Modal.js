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
                    editModalContent(answer);
                } else {
                    localStorage['session'] = 'none'
                    editModalContent("Не выполнен вход в аккаунт");
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
                    editModalContent(answer.emp);
                } else {
                    editModalContent(answer.details);
                }
            }).catch(error => {
                alert('Нет связи с сервером')
            })
        } else if (props.about == 'student') {
            fetch(`${connectionString}/getStudentInfo`, {
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
                    editModalContent(answer.stud);
                } else {
                    editModalContent(answer.details);
                }
            }).catch(error => {
                alert('Нет связи с сервером')
            })
        }
    }, []);


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
                    {/*ERROR MODAL*/}
                    {modalContent &&
                    typeof modalContent === 'string' &&
                    <div className={`modal-content`}>
                        {modalContent}
                    </div>
                    }
                    {/*USER MODAL*/}
                    {modalContent &&
                    typeof modalContent !== 'string' &&
                    props.about == 'user' &&
                    <div className={`modal-content`}>
                        <div className={`modal-content-row`}>
                            <div>
                                ФИО:
                            </div>
                            <div>
                                {modalContent.surname} {modalContent.name} {modalContent.patron}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Логин:
                            </div>
                            <div>
                                {modalContent.login}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Факультет:
                            </div>
                            <div>
                                {modalContent.fac == null ? '(нет)' : modalContent.fac}
                            </div>
                        </div>
                    </div>
                    }
                    {/*EMPLOYEE MODAL*/}
                    {modalContent &&
                    typeof modalContent !== 'string' &&
                    props.about == 'employee' &&
                    <div className={`modal-content`}>
                        <div className={`modal-content-row`}>
                            <div>
                                ФИО:
                            </div>
                            <div>
                                {modalContent.surname} {modalContent.name} {modalContent.patron}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Структурное подразделение:
                            </div>
                            <div>
                                {modalContent.dname} ({modalContent.fname})
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Должность:
                            </div>
                            <div>
                                {modalContent.pname}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Дата рождения:
                            </div>
                            <div>
                                {new Date(modalContent.birthdate).toLocaleDateString()}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Возраст:
                            </div>
                            <div>
                                {Math.floor((new Date() - new Date(modalContent.birthdate)) / (1000 * 60 * 60 * 24 * 365))}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Ученое звание:
                            </div>
                            <div>
                                {modalContent.aname}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Образование:
                            </div>
                            <div>
                                {modalContent.einame}
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
                                            {modalContent.qual_up}
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
                                <DoughnutChart key={Math.random()} about='employee' id={props.id}
                                               startDate={filterStartDate}
                                               endDate={filterEndDate}/>
                                <div>
                                    <TableGroupByComponent key={Math.random()} about="employee" id={props.id}
                                                           startDate={filterStartDate}
                                                           endDate={filterEndDate}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                    {/*STUDENT INFO*/}
                    {modalContent &&
                    typeof modalContent !== 'string' &&
                    props.about == 'student' &&
                    <div className={`modal-content`}>
                        <div className={`modal-content-row`}>
                            <div>
                                ФИО:
                            </div>
                            <div>
                                {modalContent.surname} {modalContent.name} {modalContent.patron}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Год поступления:
                            </div>
                            <div>
                                {modalContent.enroll_year}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Факультет:
                            </div>
                            <div>
                                {modalContent.fname}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Группа:
                            </div>
                            <div>
                                {modalContent.gname}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Студенческий номер:
                            </div>
                            <div>
                                {modalContent.id}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Статус:
                            </div>
                            <div>
                                {modalContent.status}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Направление подготовки:
                            </div>
                            <div>
                                {modalContent.dname}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Профиль подготовки:
                            </div>
                            <div>
                                {modalContent.pname}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Курс обучения:
                            </div>
                            <div>
                                {modalContent.stud_year}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Форма обучения:
                            </div>
                            <div>
                                {modalContent.stud_form}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Основа обучения:
                            </div>
                            <div>
                                {modalContent.funding}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Регион:
                            </div>
                            <div>
                                {modalContent.region}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Дата рождения:
                            </div>
                            <div>
                                {new Date(modalContent.birthdate).toLocaleDateString()}
                            </div>
                        </div>
                        <div className={`modal-content-row`}>
                            <div>
                                Пол:
                            </div>
                            <div>
                                {modalContent.sex == 'М' ? 'Мужской' : 'Женский'}
                            </div>
                        </div>
                        <div className={`modal-block`}>
                            <div>
                                Статистика по оценкам:
                            </div>
                            <div className={`modal-chart-and-table`}>
                                <DoughnutChart key={Math.random()} about='student' id={props.id}/>
                                <div>

                                </div>
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </div>
        </Fade>
    )
}

export default Modal