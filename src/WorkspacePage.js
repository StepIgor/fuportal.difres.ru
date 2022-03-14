import Header from "./Header";
import NavMenu from "./NavMenu";
import Content from "./Content";
import "./CSS/WorkspacePage.css";
import {useState} from "react";

function WorkspacePage(props) {

    let [subpage, editSubpage] = useState('employees')

    return (
        <div className='ws-wrapper'>
            <Header editPage={props.editPage} />
            <div className={`menu-and-content-blocks-container`}>
                <NavMenu subpage={subpage} editSubpage={editSubpage} />
                <Content subpage={subpage} editSubpage={editSubpage} />
            </div>
        </div>
    )
}

export default WorkspacePage;