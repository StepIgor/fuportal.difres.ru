import "./CSS/TableGroupByComponent.css";
import {useEffect, useState} from "react";
import {connectionString} from "../vars";
import TableGroupByComponentDetails from "./TableGroupByComponentDetails";


function TableGroupByComponent(props) {

    let [data, editData] = useState();
    let [marksTotal, editMarksTotal] = useState();
    let [avgMark, editAvgMark] = useState();

    //details popup block
    let [detailsBlockVisible, setDetailsBlockVisible] = useState(false);
    let [detailsBlockSubjectId, setDetailsBlockSubjectId] = useState();
    let [detailsBlockSubjectName, setDetailsBlockSubjectName] = useState();

    useEffect(() => {
        if (props.about == 'employee') {
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
        } else if (props.about == 'subject') {
            fetch(`${connectionString}/getSubjectAcademicPlans`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session: localStorage['session'],
                    id: props.id
                })
            }).then((res) => res.json()).then((answer) => {
                if (answer.status == 'done') {
                    if (answer.plans.length > 0) {
                        editData(answer.plans.map(row => {
                            let output_row = {
                                "cform": row.cform,
                                "fname": row.name,
                                "year": row.my.split('.')[1],
                                "sform": row.sform
                            }
                            let semester;
                            if (Number.parseInt(row.my.split('.')[0]) < 5) {
                                semester = 2 * Number.parseInt(row["ydiff"]) - 1;
                            } else {
                                semester = 2 * Number.parseInt(row["ydiff"]);
                            }
                            output_row.semester = semester;
                            return output_row;
                        }))
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
    }, [])

    if (data) {
        if (props.about == 'employee')
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
                    {detailsBlockVisible && <TableGroupByComponentDetails userId={props.id}
                                                                          subjectId={detailsBlockSubjectId}
                                                                          startDate={props.startDate}
                                                                          endDate={props.endDate}
                                                                          subjectName={detailsBlockSubjectName}
                                                                          key={Math.random()}
                    />}
                </div>
            );

        if (props.about == 'subject')
            return (
                <div className={`tableGroupBy-wrapper`}>
                    <table className={`tableGroupBy-table`}>
                        <thead>
                        <tr>
                            <td>
                                №
                            </td>
                            <td>
                                Год
                            </td>
                            <td>
                                Форма контроля
                            </td>
                            <td>
                                Факультет
                            </td>
                            <td>
                                Форма обучения
                            </td>
                            <td>
                                Семестр
                            </td>
                        </tr>
                        </thead>
                        <tbody>
                        {data.sort((a, b) => Number.parseInt(a["year"]) - Number.parseInt(b["year"])).map((plan, ind) => {
                            return (
                                <tr key={ind}>
                                    <td>
                                        {ind + 1}
                                    </td>
                                    <td>
                                        {plan["year"]}
                                    </td>
                                    <td>
                                        {plan["cform"]}
                                    </td>
                                    <td>
                                        {plan["fname"]}
                                    </td>
                                    <td>
                                        {plan["sform"]}
                                    </td>
                                    <td>
                                        {plan["semester"]}
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            );
    } else {
        return (
            <div></div>
        )
    }
}

export default TableGroupByComponent;