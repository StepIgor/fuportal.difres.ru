import {useEffect, useState} from "react";
import "./CSS/TableGroupByDetailsPopup.css";
import {connectionString} from "./vars";

function TableGroupByDetailsPopup(props) {

    let [data, setData] = useState();

    let [lastUserId, setLastUserId] = useState();
    let [lastSubjId, setLastSubjId] = useState();
    let [lastStartDate, setLastStartDate] = useState();
    let [lastEndDate, setLastEndDate] = useState();

    useEffect(() => {
        if (props.availableSubjects.indexOf(props.subjectId) == -1) {
            props.setDetailsBlockVisible(false);
            return
        }
        if (props.userId == lastUserId && props.subjectId == lastSubjId && props.endDate == lastEndDate && props.startDate == lastStartDate) return;

        setLastUserId(props.userId);
        setLastSubjId(props.subjectId);
        setLastStartDate(props.startDate);
        setLastEndDate(props.endDate);

        fetch(`${connectionString}/getGroupedSubjectMarksFilteredByEmployee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session: localStorage['session'],
                empId: props.userId,
                subjId: props.subjectId,
                startDate: props.startDate,
                endDate: props.endDate
            })
        }).then(res => res.json()).then(answer => {
            if (answer.status == 'done') {
                setData(answer.marks);
            } else {
                setData(answer.details);
            }
        }).catch(error => {
            setData('Нет соединения с сервером');
        })
    })

    if (data != null) {
        if (typeof data === 'string') {
            return (
                <div className={`mdetails-wrapper`}>
                    {data.toString()}
                </div>
            )
        } else {
            return (
                <div className={`mdetails-wrapper`}>
                    <div>
                        Детализация по предмету
                        <span>
                        {props.subjectName}
                    </span>
                    </div>
                    <div>
                        <table>
                            <thead>
                            <tr>
                                <td>
                                    Оценка
                                </td>
                                <td>
                                    Количество
                                </td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                data.map((subj, ind) => {
                                    return (
                                        <tr key={ind}>
                                            <td>
                                                {subj.mark == 0 ? 'Не зачтено' : subj.mark == 1 ? 'Зачтено' : subj.mark}
                                            </td>
                                            <td>
                                                {subj['COUNT(mark)']}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }
    } else {
        return (
            <div>
                ...
            </div>
        )
    }
}

export default TableGroupByDetailsPopup;