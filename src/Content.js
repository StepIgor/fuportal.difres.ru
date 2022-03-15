import EmployeesSubpage from "./WS_Subpages/EmployeesSubpage";
import "./CSS/Content.css";
import StudentsSubpage from "./WS_Subpages/StudentsSubpage";

function Content(props){
    return (
        <div className={`content-container`}>
            {props.subpage == 'employees' ? <EmployeesSubpage editSubpage={props.editSubpage} /> : props.subpage == 'students' ? <StudentsSubpage editSubpage={props.editSubpage} /> : props.subpage}
        </div>
    )
}

export default Content;