import EmployeesSubpage from "./WS_Subpages/EmployeesSubpage";
import "./CSS/Content.css";
import StudentsSubpage from "./WS_Subpages/StudentsSubpage";
import SubjectsSubpage from "./WS_Subpages/SubjectsSubpage";

function Content(props){
    return (
        <div className={`content-container`}>
            {props.subpage == 'employees' ? <EmployeesSubpage editSubpage={props.editSubpage} /> : props.subpage == 'students' ? <StudentsSubpage editSubpage={props.editSubpage} /> : <SubjectsSubpage editSubpage={props.editSubpage} />}
        </div>
    )
}

export default Content;