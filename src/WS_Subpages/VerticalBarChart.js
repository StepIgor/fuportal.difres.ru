import {Bar} from "react-chartjs-2";
import {useEffect, useState} from "react";
import {connectionString} from "../vars";
import 'chart.js/auto';


function VerticalBarChart(props) {

    let [data, editData] = useState();

    useEffect(() => {
        fetch(`${connectionString}/getStudentAvgMarksGroupedByHalfyears`, {
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
                let labels = answer.marks.map((group) => new Date(group["event_date"]).toLocaleDateString().replace(/\d+\./, ''));
                let data = answer.marks.map((group) => group["avgMark"]);
                if (data.length > 0) {
                    editData({
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: '#007D8C',
                            borderColor: '#00C6D8'
                        }]
                    });
                } else {
                    editData('Нет данных');
                }
            } else {
                editData(answer.details);
            }
        }).catch((error) => {
            editData('Нет связи с сервером');
        })
    }, []);

    if (data != null) {
        if (typeof data == 'string') {
            {
                return (
                    <div className={`chart-no-data-label`}>
                        {data.toString()}
                    </div>
                )
            }
        } else {
            return (
                <Bar type={'bar'}
                     data={data}
                     options={{
                         responsive: true,
                         maintainAspectRatio: false,
                         plugins: {
                             title: {
                                 display: true,
                                 text: "Средняя оценка по семестрам"
                             },
                             legend: {
                                 display: false
                             }
                         },
                     }}
                />
            )
        }
    }

    return (
        <div className={`chart-no-data-label`}>
            ...
        </div>
    )
}

export default VerticalBarChart;