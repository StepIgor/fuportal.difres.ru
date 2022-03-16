import "./CSS/SubjectsSubpage.css";
import {useEffect, useState} from "react";
import {connectionString} from "../vars";

function SubjectsSubpage(props){

    let [subjects, editSubjects] = useState()
    let [userFilterText, editUserFilterText] = useState()

    useEffect(() => {
        if (subjects != null) return;
        fetch(`${connectionString}/getAllSubjects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session: localStorage['session']
            })
        }).then(res => res.json()).then(answer => {
            if (answer.status == 'done') {
                editSubjects(answer.subjects);
            } else {
                localStorage['session'] = 'none'
                props.editSubpage('login')
            }
        }).catch(error => {
            alert('Нет связи с сервером')
        })
    })

    return (
        <div className={`subj-sp-container`}>
            <div className={`subj-sp-filter-container`}>
                <input placeholder="Поиск по названию..." type="text" maxLength="64" onChange={(e) => {editUserFilterText(e.target.value)}} />
            </div>
            <div className={`subj-sp-table-container`}>
                <table>
                    <thead>
                    <tr>
                        <td>
                            <span>№</span>
                        </td>
                        <td>
                            <span>Название</span>
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        subjects &&
                        subjects.filter((subj) => {
                            if (userFilterText == null || userFilterText.replace(/ /g, '').length < 1) return true;
                            return subj.name.toLowerCase().indexOf(userFilterText.toLowerCase()) != -1;
                        }).sort((a, b) => {
                            return ''+a.name.localeCompare(b.name);
                        }).map((subj, ind) => {
                            return (
                                <tr key={subj.id}>
                                    <td>
                                        {ind + 1}
                                    </td>
                                    <td>
                                        {subj.name}
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

export default SubjectsSubpage;