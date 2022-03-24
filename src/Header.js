import "./CSS/Header.css";
import {useEffect, useState} from "react";
import {connectionString} from "./vars";
import Modal from "./Modal";
import SearchResultsBlock from "./SearchResultsBlock";

function Header(props) {

    let [name, editName] = useState()
    let [menuOpened, editMenuOpened] = useState(false)
    let [showUserCard, editShowUserCard] = useState(false)

    //search bar
    let [userQueryText, setUserQueryText] = useState();
    let [showSearchResults, setShowSearchResults] = useState();

    useEffect(() => {
        if (!name) {
            fetch(`${connectionString}/getMoodleName`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session: localStorage['session']
                })
            }).then(res => res.json()).then(answer => {
                if (answer.status == 'done') {
                    editName(`${answer.surname} ${answer.name[0]}. ${answer.patron[0]}.`)
                } else {
                    localStorage['session'] = 'none'
                }
            }).catch(error => {
                alert('Нет связи с сервером')
            })
        }
    })

    function logout() {
        fetch(`${connectionString}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session: localStorage['session']
            })
        }).then(res => res.json()).then(answer => {
            localStorage['session'] = 'none';
            props.editPage('login');
        }).catch(error => {
            alert('Нет связи с сервером')
        })
    }

    return (
        <div className='hd-wrapper' onClick={() => {
            editMenuOpened(false);
            setShowSearchResults(false)
        }}>
            <div className='hd-logo-container'>
                <a href="https://org.fa.ru" target="_blank"><img src="logo2.png"/></a>
                <div className='moodle-mob-container'>
                    <div className="moodle-mob" onClick={(e) => {
                        editMenuOpened(!menuOpened);
                        e.stopPropagation()
                    }}>
                        <span>{name}</span>
                        <i className="material-icons">arrow_drop_down</i>
                    </div>
                    {
                        menuOpened &&
                        <div className="moodle-menu-mob">
                            <div onClick={(e) => {
                                e.stopPropagation();
                                editShowUserCard(true);
                                editMenuOpened(false)
                            }}>
                                О пользователе
                            </div>
                            <div onClick={(e) => {
                                e.stopPropagation();
                                logout()
                            }}>
                                Выход
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className='hd-searchbar-container' onClick={(e) => e.stopPropagation()}>
                <input className="hd-searchbar" onChange={(e) => {
                    setShowSearchResults(false);
                    setUserQueryText(e.target.value);
                }} onKeyDown={(e) => {
                    if (e.key.toLowerCase() == 'enter' && userQueryText != null && userQueryText.replace(/ /g, '').length > 0) setShowSearchResults(true);
                }} type="text" maxLength="64" placeholder="Начать поиск..."/>
                {
                    showSearchResults &&
                    <SearchResultsBlock query={userQueryText}/>
                }
            </div>
            <div className='hd-moodle-container'>
                <div className="moodle" onClick={(e) => {
                    editMenuOpened(!menuOpened);
                    e.stopPropagation()
                }}>
                    <span>{name}</span>
                    <i className="material-icons">arrow_drop_down</i>
                </div>
                {
                    menuOpened &&
                    <div className="moodle-menu">
                        <div onClick={(e) => {
                            e.stopPropagation();
                            editShowUserCard(true);
                            editMenuOpened(false)
                        }}>
                            О пользователе
                        </div>
                        <div onClick={(e) => {
                            e.stopPropagation();
                            logout()
                        }}>
                            Выход
                        </div>
                    </div>
                }
            </div>
            {
                showUserCard &&
                <Modal editVisible={editShowUserCard} about='user'/>
            }
        </div>
    )
}

export default Header;