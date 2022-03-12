import {useEffect, useState} from "react";
import LoginPage from "./LoginPage";
import WorkspacePage from "./WorkspacePage";
import {connectionString} from "./vars";

function App() {

    let [page, editPage] = useState();

    useEffect(() => {
        if (localStorage['session'] == null) {
            localStorage['session'] = 'none';
        }

        if (localStorage['session'] != 'none') {
            fetch(`${connectionString}/checkSessionExisting`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session: localStorage['session']
                })
            }).then(res => res.json()).then(answer => {
                if (answer.status == 'done') {
                    if (answer.details == 'alive') {
                        editPage('workspace')
                    } else {
                        localStorage['session'] = 'none';
                        editPage('login');
                    }
                } else {
                    localStorage['session'] = 'none';
                    editPage('login')
                }
            }).catch(error => {
                editPage('login')
                alert('Нет связи с сервером.')
            })
        } else {
            editPage('login')
        }
    })

    return page ? page == 'login' ? <LoginPage editPage={editPage} /> : <WorkspacePage editPage={editPage} /> : null
}

export default App;
