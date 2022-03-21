import {useEffect, useState} from "react";
import "./CSS/TableGroupByComponentDetails.css";
import {connectionString} from "../vars";

function TableGroupByComponentDetails(props) {

    let [data, setData] = useState();

    useEffect(() => {
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
    }, []);

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

export default TableGroupByComponentDetails;