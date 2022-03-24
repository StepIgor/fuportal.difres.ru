import "./CSS/SearchResultsBlock.css";
import {useEffect, useState} from "react";
import {connectionString} from "./vars";


function SearchResultsBlock(props) {

    let [searchResult, setSearchResult] = useState();

    useEffect(() => {
        if (props.query.replace(/ /g, '').length < 1) return;
        fetch(`${connectionString}/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session: localStorage['session'],
                query: props.query
            })
        }).then(res => res.json()).then(answer => {
            if (answer.status == 'done') {
                setSearchResult(answer.results);
            } else {
                setSearchResult(answer.details);
            }
        }).catch((error) => {
            setSearchResult('Нет связи с сервером');
        })
    }, []);


    if (searchResult != null) {
        if (typeof searchResult == 'string') {
            return (
                <div className={`sr-wrapper`}>
                    <div className={`sr-waiting-for-answer`}>
                        {searchResult}
                    </div>
                </div>
            )
        } else {
            if (searchResult.length > 0){
                return (
                    <div className={`sr-wrapper`}>
                        {searchResult.map((row, ind) => {
                            return (
                                <div key={ind} className={`sr-result-line`}>
                                    <div>
                                        {row.name}
                                    </div>
                                    <div>
                                        {row.desc}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            } else {
                return (
                    <div className={`sr-wrapper`}>
                        <div className={`sr-waiting-for-answer`}>
                            Ничего не найдено
                        </div>
                    </div>
                )
            }
        }
    } else {
        return (
            <div className={`sr-wrapper`}>
                <div className={`sr-waiting-for-answer`}>
                    ...
                </div>
            </div>
        )
    }
}

export default SearchResultsBlock;