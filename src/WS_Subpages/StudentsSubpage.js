import "./CSS/StudentsSubpage.css";
import {useEffect, useState} from "react";
import {connectionString} from "../vars";
import Modal from "../Modal";

function StudentsSubpage(props){

    let [students, editStudents] = useState()
    let [sortMode, editSortMode] = useState('surname')
    let [filterMode, editFilterMode] = useState('name')
    let [userFilterText, editUserFilterText] = useState()
    let [showExtendedFilterForm, editShowExtendedFilterForm] = useState(false);
    let [extraUserFilterText, editExtraUserFilterText] = useState();
    let [extraFilterMode, editExtraFilterMode] = useState('fac_name');

    //stud card
    let [modalVisible, editModalVisible] = useState(false);
    let [studIdClicked, editStudIdClicked] = useState();

    useEffect(() => {
        if (students != null) return;
        fetch(`${connectionString}/getAllStudents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session: localStorage['session']
            })
        }).then(res => res.json()).then(answer => {
            if (answer.status == 'done') {
                editStudents(answer.students);
            } else {
                localStorage['session'] = 'none'
                props.editSubpage('login')
            }
        }).catch(error => {
            alert('Нет связи с сервером')
        })
    })

    return (
        <div className={`stud-sp-container`}>
            {
                modalVisible &&
                <Modal editVisible={editModalVisible} about='student' id={studIdClicked} />
            }
            <div className={`stud-sp-filter-container`}>
                <input placeholder="Поиск по параметру..." type="text" maxLength="64" onChange={(e) => {editUserFilterText(e.target.value)}} />
                <div className={`stud-sp-filter-rb-group`}>
                    <div className={`stud-sp-filter-rb-option`} onClick={()=>{editFilterMode('name')}}>
                        {filterMode == 'name' && <i className={`material-icons`}>radio_button_checked</i>}
                        {filterMode != 'name' && <i className={`material-icons`}>radio_button_unchecked</i>}
                        <span>ФИО</span>
                    </div>
                    <div className={`stud-sp-filter-rb-option`} onClick={()=>{editFilterMode('id')}}>
                        {filterMode == 'id' && <i className={`material-icons`}>radio_button_checked</i>}
                        {filterMode != 'id' && <i className={`material-icons`}>radio_button_unchecked</i>}
                        <span>Студ. номер</span>
                    </div>
                    <div className={`stud-sp-filter-rb-option`} onClick={()=>{editFilterMode('dir_name')}}>
                        {filterMode == 'dir_name' && <i className={`material-icons`}>radio_button_checked</i>}
                        {filterMode != 'dir_name' && <i className={`material-icons`}>radio_button_unchecked</i>}
                        <span>Направление</span>
                    </div>
                    <div className={`stud-sp-filter-rb-option`} onClick={()=>{editFilterMode('stud_year')}}>
                        {filterMode == 'stud_year' && <i className={`material-icons`}>radio_button_checked</i>}
                        {filterMode != 'stud_year' && <i className={`material-icons`}>radio_button_unchecked</i>}
                        <span>Курс</span>
                    </div>
                </div>
            </div>
            {
                !showExtendedFilterForm &&
                <div className={`stud-sp-show-extra-filter-link`} onClick={() => {editShowExtendedFilterForm(true)}}>
                    Открыть расширенные параметры фильтрации
                </div>
            }
            {
                showExtendedFilterForm &&
                <div className={`stud-sp-filter-container`}>
                    <input placeholder="Поиск по доп. параметру..." type="text" maxLength="64" onChange={(e) => {editExtraUserFilterText(e.target.value)}} />
                    <div className={`stud-sp-filter-rb-group`}>
                        <div className={`stud-sp-filter-rb-option`} onClick={()=>{editExtraFilterMode('fac_name')}}>
                            {extraFilterMode == 'fac_name' && <i className={`material-icons`}>radio_button_checked</i>}
                            {extraFilterMode != 'fac_name' && <i className={`material-icons`}>radio_button_unchecked</i>}
                            <span>Факультет</span>
                        </div>
                        <div className={`stud-sp-filter-rb-option`} onClick={()=>{editExtraFilterMode('prof_name')}}>
                            {extraFilterMode == 'prof_name' && <i className={`material-icons`}>radio_button_checked</i>}
                            {extraFilterMode != 'prof_name' && <i className={`material-icons`}>radio_button_unchecked</i>}
                            <span>Профиль</span>
                        </div>
                        <div className={`stud-sp-filter-rb-option`} onClick={()=>{editExtraFilterMode('citizenship')}}>
                            {extraFilterMode == 'citizenship' && <i className={`material-icons`}>radio_button_checked</i>}
                            {extraFilterMode != 'citizenship' && <i className={`material-icons`}>radio_button_unchecked</i>}
                            <span>Гражданство</span>
                        </div>
                        <div className={`stud-sp-filter-rb-option`} onClick={()=>{editExtraFilterMode('region')}}>
                            {extraFilterMode == 'region' && <i className={`material-icons`}>radio_button_checked</i>}
                            {extraFilterMode != 'region' && <i className={`material-icons`}>radio_button_unchecked</i>}
                            <span>Регион РФ</span>
                        </div>
                        <div className={`stud-sp-filter-rb-option`} onClick={()=>{editExtraFilterMode('stud_form')}}>
                            {extraFilterMode == 'stud_form' && <i className={`material-icons`}>radio_button_checked</i>}
                            {extraFilterMode != 'stud_form' && <i className={`material-icons`}>radio_button_unchecked</i>}
                            <span>Форма обучения</span>
                        </div>
                        <div className={`stud-sp-filter-rb-option`} onClick={()=>{editExtraFilterMode('funding')}}>
                            {extraFilterMode == 'funding' && <i className={`material-icons`}>radio_button_checked</i>}
                            {extraFilterMode != 'funding' && <i className={`material-icons`}>radio_button_unchecked</i>}
                            <span>Финансирование</span>
                        </div>
                    </div>
                </div>
            }
            <div className={`stud-sp-table-container`}>
                <table>
                    <thead>
                    <tr>
                        <td>
                            <span>№</span>
                        </td>
                        <td onClick={() => {
                            editSortMode('surname')
                        }}>
                            {sortMode == 'surname' && <i className={`material-icons`}>sort</i>}
                            <span>Фамилия</span>
                        </td>
                        <td onClick={() => {
                            editSortMode('name')
                        }}>
                            {sortMode == 'name' && <i className={`material-icons`}>sort</i>}
                            <span>Имя</span>
                        </td>
                        <td onClick={() => {
                            editSortMode('patron')
                        }}>
                            {sortMode == 'patron' && <i className={`material-icons`}>sort</i>}
                            <span>Отчество</span>
                        </td>
                        <td onClick={() => {
                            editSortMode('sex')
                        }}>
                            {sortMode == 'sex' && <i className={`material-icons`}>sort</i>}
                            <span>Пол</span>
                        </td>
                        <td onClick={() => {
                            editSortMode('fac_name')
                        }}>
                            {sortMode == 'fac_name' && <i className={`material-icons`}>sort</i>}
                            <span>Факультет</span>
                        </td>
                        <td onClick={() => {
                            editSortMode('email')
                        }}>
                            {sortMode == 'email' && <i className={`material-icons`}>sort</i>}
                            <span>Email</span>
                        </td>
                        <td onClick={() => {
                            editSortMode('id')
                        }}>
                            {sortMode == 'id' && <i className={`material-icons`}>sort</i>}
                            <span>Студ. номер</span>
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        students &&
                        students.filter((stud) => {
                            if (userFilterText == null || userFilterText.replace(/ /g, '').length < 1) return true;
                            if (filterMode == 'name'){
                                return (stud.surname + ' ' + stud.name + ' ' + stud.patron).toLowerCase().indexOf(userFilterText.toLowerCase()) != -1;
                            } else if (filterMode == 'id'){
                                return stud.id.toString().toLowerCase().indexOf(userFilterText.toLowerCase()) != -1;
                            } else if (filterMode == 'dir_name') {
                                return stud.dir_name.toLowerCase().indexOf(userFilterText.toLowerCase()) != -1;
                            } else {
                                //stud_year
                                return stud.stud_year == userFilterText;
                            }
                        }).filter((stud) => {
                            if (extraUserFilterText == null || extraUserFilterText.replace(/ /g, '').length < 1) return true;
                            if (extraFilterMode == 'fac_name'){
                                return stud.fac_name.toLowerCase().indexOf(extraUserFilterText.toLowerCase()) != -1;
                            } else if (extraFilterMode == 'prof_name'){
                                return stud.prof_name.toLowerCase().indexOf(extraUserFilterText.toLowerCase()) != -1;
                            } else if (extraFilterMode == 'citizenship'){
                                return stud.citizenship.toLowerCase().indexOf(extraUserFilterText.toLowerCase()) != -1;
                            } else if (extraFilterMode == 'region'){
                                return stud.region.toLowerCase().indexOf(extraUserFilterText.toLowerCase()) != -1;
                            } else if (extraFilterMode == 'stud_form'){
                                return stud.stud_form.toLowerCase().indexOf(extraUserFilterText.toLowerCase()) != -1;
                            } else {
                                //funding
                                return stud.funding.toLowerCase().indexOf(extraUserFilterText.toLowerCase()) != -1;
                            }
                        }).sort((a, b) => {
                            if (sortMode == 'id'){
                                return a.id - b.id
                            } else if (sortMode == 'name'){
                                return (''+a.name).localeCompare(b.name);
                            } else if (sortMode == 'surname'){
                                return (''+a.surname).localeCompare(b.surname);
                            } else if (sortMode == 'patron'){
                                return (''+a.patron).localeCompare(b.patron);
                            } else if (sortMode == 'sex'){
                                return (''+a.sex).localeCompare(b.sex);
                            } else if (sortMode == 'fac_name'){
                                return (''+a.fac_name).localeCompare(b.fac_name);
                            } else {
                                //email
                                return (''+a.email).localeCompare(b.email);
                            }
                        }).map((stud, ind) => {
                            return (
                                <tr key={stud.id} onClick={()=>{editStudIdClicked(stud.id); editModalVisible(true);}}>
                                    <td>
                                        {ind + 1}
                                    </td>
                                    <td>
                                        {stud.surname}
                                    </td>
                                    <td>
                                        {stud.name}
                                    </td>
                                    <td>
                                        {stud.patron}
                                    </td>
                                    <td>
                                        {stud.sex}
                                    </td>
                                    <td>
                                        {stud.fac_name}
                                    </td>
                                    <td>
                                        {stud.email}
                                    </td>
                                    <td>
                                        {stud.id}
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

export default StudentsSubpage;