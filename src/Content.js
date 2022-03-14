import EmployeesSubpage from "./WS_Subpages/EmployeesSubpage";
import "./CSS/Content.css";

function Content(props){
    return (
        <div className={`content-container`}>
            {props.subpage == 'employees' ? <EmployeesSubpage editSubpage={props.editSubpage} /> : props.subpage}
        </div>
    )
}

export default Content;