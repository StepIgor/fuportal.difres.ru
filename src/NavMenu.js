import "./CSS/NavMenu.css"
import {useState} from "react";


function NavMenu(props) {

    let [mobMenuRevealed, editMobMenuRevealed] = useState(false)

    return (
        <div className={`navmenu-container`}>
            <div className={`navmenu-title`}>
                Навигация
            </div>
            <div className={`navmenu-buttons`}>
                <div className={`${props.subpage == 'employees' ? 'navmenu-button-selected' : ''}`} onClick={() => {
                    props.editSubpage('employees')
                }}>
                    Сотрудники
                </div>
                <div className={`${props.subpage == 'students' ? 'navmenu-button-selected' : ''}`} onClick={() => {
                    props.editSubpage('students')
                }}>
                    Обучающиеся
                </div>
                <div className={`${props.subpage == 'subjects' ? 'navmenu-button-selected' : ''}`} onClick={() => {
                    props.editSubpage('subjects')
                }}>
                    Дисциплины
                </div>
            </div>
            <div className={`mob-navmenu-title`} onClick={() => {
                editMobMenuRevealed(!mobMenuRevealed)
            }}>
                <div>
                    {props.subpage == 'employees' ? 'Сотрудники' : props.subpage == 'students' ? 'Обучающиеся' : 'Дисциплины'}
                </div>
                <i className={`material-icons`}>menu</i>
            </div>
            {
                mobMenuRevealed &&
                <div className={`mob-navmenu-buttons`}>
                    <div className={`${props.subpage == 'employees' ? 'navmenu-button-selected' : ''}`}
                         onClick={() => {
                             props.editSubpage('employees');
                             editMobMenuRevealed(false);
                         }}>
                        Сотрудники
                    </div>
                    <div className={`${props.subpage == 'students' ? 'navmenu-button-selected' : ''}`}
                         onClick={() => {
                             props.editSubpage('students');
                             editMobMenuRevealed(false);
                         }}>
                        Обучающиеся
                    </div>
                    <div className={`${props.subpage == 'subjects' ? 'navmenu-button-selected' : ''}`}
                         onClick={() => {
                             props.editSubpage('subjects');
                             editMobMenuRevealed(false);
                         }}>
                        Дисциплины
                    </div>
                </div>
            }
        </div>
    )
}

export default NavMenu;