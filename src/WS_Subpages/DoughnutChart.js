import {Doughnut} from "react-chartjs-2";
import {useEffect, useState} from "react";
import {connectionString} from "../vars";
import 'chart.js/auto';
import "./CSS/DoughnutChart.css"
import ChartDataLabels from 'chartjs-plugin-datalabels';


function DoughnutChart(props) {

    let [data, editData] = useState();
    let [studentAvgMark, editStudentAngMark] = useState();

    useEffect(() => {
        if (props.about == 'employee') {
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
                    if (data.length > 0) {
                        editData({
                            labels: labels,
                            datasets: [{
                                data: data,
                                backgroundColor: ['#f44336', '#9c27b0', '#3f51b5', '#009688', '#ff9800', '#795548']
                            }]
                        });
                    } else {
                        editData('Нет данных за указанный период');
                    }
                } else {
                    editData(answer.details);
                }
            }).catch((error) => {
                editData('Нет связи с сервером');
            })
        } else if (props.about == 'student'){
            fetch(`${connectionString}/getStudentMarksGroupedChartData`, {
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
                    let labels = answer.marks.map((group) => {
                        if (group.mark == 1) return 'Зачтено';
                        return group.mark;
                    });
                    let data = answer.marks.map((group) => group["COUNT(mark)"]);
                    //count avg
                    let filteredMarkGroups = answer.marks.filter((group) => Number.parseInt(group["mark"]) != 0 && Number.parseInt(group["mark"]) != 1);
                    let totalMarks = filteredMarkGroups.map((group) => Number.parseInt(group["COUNT(mark)"])).reduce((ac, count) => ac + count, 0);
                    let marksSum = filteredMarkGroups.map((group) => Number.parseInt(group["COUNT(mark)"]) * Number.parseInt(group["mark"])).reduce((ac, val) => ac + val, 0);
                    editStudentAngMark((marksSum / totalMarks).toFixed(2));
                    //for chart
                    if (data.length > 0) {
                        editData({
                            labels: labels,
                            datasets: [{
                                data: data,
                                backgroundColor: ['#f44336', '#9c27b0', '#3f51b5', '#009688', '#ff9800']
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
        }
    }, [])

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
            if (props.about == 'employee')
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
                                          let percentage = "  " + value + "  \n" + (value * 100 / sum).toFixed(0) + "%";
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
            );
            if (props.about == 'student')
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
                                              let percentage = "  " + value + "  \n" + (value * 100 / sum).toFixed(0) + "%";
                                              return percentage;
                                          }
                                      },
                                      legend: {
                                          display: true,
                                          position: "right"
                                      },
                                      title: {
                                          display: true,
                                          text: `За весь период обучения (сред. ${studentAvgMark})`
                                      }
                                  }
                              }}
                              data={data}
                              plugins={[ChartDataLabels]}
                              fontSize={14}
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

export default DoughnutChart;