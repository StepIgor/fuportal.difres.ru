import "./CSS/TableGroupByComponent.css";
import {useEffect, useState} from "react";
import {connectionString} from "../vars";
import TableGroupByComponentDetails from "./TableGroupByComponentDetails";


function TableGroupByComponent(props) {

    let [data, editData] = useState();
    let [marksTotal, editMarksTotal] = useState();
    let [avgMark, editAvgMark] = useState();

    let [lastAbout, editLastAbout] = useState();
    let [lastId, editLastId] = useState();
    let [lastStartDate, editLastStartDate] = useState();
    let [lastEndDate, editLastEndDate] = useState();

    //details popup block
    let [detailsBlockVisible, setDetailsBlockVisible] = useState(false);
    let [detailsBlockSubjectId, setDetailsBlockSubjectId] = useState();
    let [detailsBlockSubjectName, setDetailsBlockSubjectName] = useState();

    useEffect(() => {
        if (lastAbout == props.about && lastId == props.id && lastEndDate == props.endDate && lastStartDate == props.startDate) return;
        editLastEndDate(props.endDate);
        editLastStartDate(props.startDate);
        if (props.about == 'employee') {
            editLastAbout(props.about);
            editLastId(props.id);
            if (props.endDate.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) == null) return;
            if (props.startDate.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) == null) return;
            fetch(`${connectionString}/getEmpMarksGroupedBySubjects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session: localStorage['session'],
                    id: props.id,
                    startDate: props.startDate,
                    endDate: props.endDate
                })
            }).then((res) => res.json()).then((answer) => {
                if (answer.status == 'done') {
                    if (answer.marks.length > 0) {
                        editMarksTotal(answer.marks_avg_and_sum.reduce((ac, val) => ac + val['COUNT(mark)'], 0))
                        let avgMark = (answer.marks_avg_and_sum.reduce((ac, val) => {
                            if (Number.parseInt(val['mark']) > 1) {
                                return ac + (Number.parseInt(val['mark']) * Number.parseInt(val['COUNT(mark)']))
                            } else {
                                return ac
                            }
                        }, 0) / answer.marks_avg_and_sum.reduce((ac, val) => {
                            if (Number.parseInt(val['mark']) > 1) {
                                return ac + val['COUNT(mark)']
                            } else {
                                return ac
                            }
                        }, 0)).toFixed(2);
                        editAvgMark(avgMark == 'NaN' ? '(нет)' : avgMark);
                        editData(answer.marks);
                    } else {
                        editData(null);
                    }
                } else {
                    editData(null);
                }
            }).catch((error) => {
                alert('Нет связи с сервером')
            })
        }
    })

    if (data) {
        return (
            <div className={`tableGroupBy-wrapper`}>
                <table className={`tableGroupBy-table`}>
                    <thead>
                    <tr>
                        <td>
                            Дисциплина
                        </td>
                        <td>
                            Кол-во оценок
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((subj, ind) => {
                        return (
                            <tr key={ind} onClick={() => {
                                setDetailsBlockSubjectId(subj.id);
                                setDetailsBlockSubjectName(subj.name);
                                setDetailsBlockVisible(true);
                            }}>
                                <td>
                                    {subj.name}
                                </td>
                                <td>
                                    {subj['COUNT(m.mark)']}
                                </td>
                            </tr>
                        )
                    })}
                    <tr>
                        <td>
                            <b>Всего оценок</b>
                        </td>
                        <td className={`total-label`}>
                            {marksTotal}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Средний балл</b>
                        </td>
                        <td className={`total-label`}>
                            {avgMark}
                        </td>
                    </tr>
                    </tbody>
                </table>
                {detailsBlockVisible && <TableGroupByComponentDetails visibility={detailsBlockVisible} userId={props.id}
                                                                      subjectId={detailsBlockSubjectId}
                                                                      startDate={props.startDate} endDate={props.endDate}
                                                                      setDetailsBlockVisible={setDetailsBlockVisible}
                                                                      subjectName={detailsBlockSubjectName}
                                                                      availableSubjects={data.map((subj) => subj.id)}
                />}
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
}

export default TableGroupByComponent;