import {Doughnut} from "react-chartjs-2";
import {useEffect, useRef, useState} from "react";
import {connectionString} from "../vars";
import 'chart.js/auto';
import "./CSS/DoughnutChart.css"
import ChartDataLabels from 'chartjs-plugin-datalabels';


function DoughnutChart(props) {

    let [data, editData] = useState();
    let [errorText, editErrorText] = useState();

    let [lastAbout, editLastAbout] = useState();
    let [lastId, editLastId] = useState();
    let [lastStartDate, editLastStartDate] = useState();
    let [lastEndDate, editLastEndDate] = useState();

    useEffect(() => {
        if (lastAbout == props.about && lastId == props.id && lastEndDate == props.endDate && lastStartDate == props.startDate) return;
        editLastEndDate(props.endDate);
        editLastStartDate(props.startDate);
        if (props.about == 'employee'){
            editLastAbout(props.about);
            editLastId(props.id);
            if (props.endDate.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) == null) return;
            if (props.startDate.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) == null) return;
            fetch(`${connectionString}/getEmpMarksGroupedChartData`, {
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
                    let labels = answer.marks.map((group) => {
                        if (group.mark == 0) return 'Не зачтено';
                        if (group.mark == 1) return 'Зачтено';
                        return group.mark;
                    });
                    let data = answer.marks.map((group) => group["COUNT(mark)"]);
                    if (data.length > 0){
                        editErrorText(null);
                        editData({
                            labels: labels,
                            datasets: [{
                                data: data,
                                backgroundColor: ['#f44336', '#9c27b0', '#3f51b5', '#009688', '#ff9800', '#795548']
                            }]
                        });
                    } else {
                        editData(null);
                        editErrorText('Нет данных за указанный период')
                    }
                } else {
                    editErrorText(answer.details);
                }
            }).catch((error) => {
                alert('Нет связи с сервером')
                editErrorText("Нет связи с сервером");
            })
        }
    })

    if (data != null){
        return (
            <Doughnut type="doughnut"
                      options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                              datalabels: {
                                  color: '#FFFFFF',
                                  font: {
                                      size: 10
                                  },
                                  formatter: (value, ctx) => {
                                      let sum = 0;
                                      let dataArr = ctx.chart.data.datasets[0].data;
                                      dataArr.map(data => {
                                          sum += data;
                                      });
                                      let percentage = "  " + value + "  \n" + (value*100 / sum).toFixed(0)+"%";
                                      return percentage;
                                  }
                              },
                              legend: {
                                  display: true,
                                  position: "right"
                              },
                          }
                      }}
                      data={data}
                      plugins={[ChartDataLabels]}
                      fontSize={14}
            />
        )
    } else {
        return (
            <div className={`chart-no-data-label`}>
                {errorText}
            </div>
        )
    }
}

export default DoughnutChart;