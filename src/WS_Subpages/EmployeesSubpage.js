import "./CSS/EmployeesSubpage.css";
import {useEffect, useState} from "react";
import {connectionString} from "../vars";
import Modal from "../Modal";

function EmployeesSubpage(props) {

    let [employees, editEmployees] = useState()
    let [sortMode, editSortMode] = useState('id')
    let [filterMode, editFilterMode] = useState('name')
    let [userFilterText, editUserFilterText] = useState()
    let [filterByBirthdate, editFilterByBirthdate] = useState(false)

    //emp card
    let [modalVisible, editModalVisible] = useState(false);
    let [empIdClicked, editEmpIdClicked] = useState();

    useEffect(() => {
        if (employees != null) return;
        fetch(`${connectionString}/getAllEmployees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session: localStorage['session']
            })
        }).then(res => res.json()).then(answer => {
            if (answer.status == 'done') {
                editEmployees(answer.employees);
            } else {
                localStorage['session'] = 'none'
                props.editSubpage('login')
            }
        }).catch(error => {
            alert('Нет связи с сервером')
        })
    })

    return (
        <div className={`emp-sp-container`}>
            {
                modalVisible &&
                <Modal editVisible={editModalVisible} about='employee' id={empIdClicked} />
            }
            <div className={`emp-sp-filter-container`}>
                <input placeholder="Поиск по параметру..." type="text" maxLength="64" onChange={(e) => {editUserFilterText(e.target.value)}} />
                <div className={`emp-sp-filter-rb-group`}>
                    <div className={`emp-sp-filter-rb-option`} onClick={()=>{editFilterMode('name')}}>
                        {filterMode == 'name' && <i className={`material-icons`}>radio_button_checked</i>}
                        {filterMode != 'name' && <i className={`material-icons`}>radio_button_unchecked</i>}
                        <span>ФИО</span>
                    </div>
                    <div className={`emp-sp-filter-rb-option`} onClick={()=>{editFilterMode('depart')}}>
                        {filterMode == 'depart' && <i className={`material-icons`}>radio_button_checked</i>}
                        {filterMode != 'depart' && <i className={`material-icons`}>radio_button_unchecked</i>}
                        <span>Подразделение</span>
                    </div>
                    <div className={`emp-sp-filter-rb-option`} onClick={()=>{editFilterMode('pos')}}>
                        {filterMode == 'pos' && <i className={`material-icons`}>radio_button_checked</i>}
                        {filterMode != 'pos' && <i className={`material-icons`}>radio_button_unchecked</i>}
                        <span>Должность</span>
                    </div>
                    <div className={`emp-sp-filter-rb-option`} onClick={()=>{editFilterByBirthdate(!filterByBirthdate)}}>
                        {filterByBirthdate && <i className={`material-icons`}>check_box</i>}
                        {!filterByBirthdate && <i className={`material-icons`}>check_box_outline_blank</i>}
                        <span>День рождения сегодня</span>
                    </div>
                </div>
            </div>
            <div className={`emp-sp-table-container`}>
                <table>
                    <thead>
                    <tr>
                        <td>
                            <span>№</span>
                        </td>
                        <td onClick={() => {
                            editSortMode('name')
                        }}>
                            {sortMode == 'name' && <i className={`material-icons`}>sort</i>}
                            <span>ФИО</span>
                        </td>
                        <td onClick={() => {
                            editSortMode('depart')
                        }}>
                            {sortMode == 'depart' && <i className={`material-icons`}>sort</i>}
                            <span>Подразделение (департамент)</span>
                        </td>
                        <td onClick={() => {
                            editSortMode('pos')
                        }}>
                            {sortMode == 'pos' && <i className={`material-icons`}>sort</i>}
                            <span>Должность</span>
                        </td>
                        <td onClick={() => {
                            editSortMode('id')
                        }}>
                            {sortMode == 'id' && <i className={`material-icons`}>sort</i>}
                            <span>Табельный номер</span>
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        employees &&
                        employees.filter((emp) => {
                            if (userFilterText == null || userFilterText.replace(/ /g, '').length < 1) return true;
                            if (filterMode == 'name'){
                                return (emp.surname + ' ' + emp.name + ' ' + emp.patron).toLowerCase().indexOf(userFilterText.toLowerCase()) != -1;
                            } else if (filterMode == 'depart'){
                                return emp.dname.toLowerCase().indexOf(userFilterText.toLowerCase()) != -1;
                            } else {
                                //pos
                                return emp.pname.toLowerCase().indexOf(userFilterText.toLowerCase()) != -1;
                            }
                        }).filter((emp) => {
                            if (!filterByBirthdate) return true;
                            return new Date(emp.birthdate).toLocaleDateString().replace(/\.[0-9]{4}/g, '') == new Date().toLocaleDateString().replace(/\.[0-9]{4}/g, '');
                        }).sort((a, b) => {
                            if (sortMode == 'id'){
                                return a.id - b.id
                            } else if (sortMode == 'name'){
                                return (''+a.surname+a.name+a.patron).localeCompare(b.surname+b.name+b.patron);
                            } else if (sortMode == 'depart'){
                                return (''+a.dname).localeCompare(b.dname);
                            } else {
                                //pos
                                return (''+a.pname).localeCompare(b.pname);
                            }
                        }).map((emp, ind) => {
                            return (
                                <tr key={emp.id} onClick={()=>{editEmpIdClicked(emp.id); editModalVisible(true);}}>
                                    <td>
                                        {ind + 1}
                                    </td>
                                    <td>
                                        {emp.surname} {emp.name} {emp.patron}
                                    </td>
                                    <td>
                                        {emp.dname}
                                    </td>
                                    <td>
                                        {emp.pname}
                                    </td>
                                    <td>
                                        {emp.id}
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

export default EmployeesSubpage