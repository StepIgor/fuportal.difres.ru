import Header from "./Header";
import NavMenu from "./NavMenu";
import Content from "./Content";
import "./CSS/WorkspacePage.css";

function WorkspacePage(props) {
    return (
        <div className='ws-wrapper'>
            <Header editPage={props.editPage} />
            <NavMenu />
            <Content />
        </div>
    )
}

export default WorkspacePage;