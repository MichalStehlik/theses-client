import React, {useEffect} from 'react';
import { Heading } from "../general";
import {Link} from "react-router-dom";
import {useAppContext, SET_TITLE} from "../../providers/ApplicationProvider";

const Title = props => {
    const [,dispatch] = useAppContext();
    useEffect(()=>{ dispatch({type: SET_TITLE, payload: "Úvodní stránka"}); },[dispatch]);
    return (
        <>
        <Heading>Administrativní rozhraní</Heading>
        <ul>
            <li><Link to="/admin/users">Uživatelé</Link></li>
            <li><Link to="/admin/sets">Sady</Link></li>
            <li><Link to="/admin/targets">Cíle</Link></li>
        </ul>
        </>
    );
}

export default Title;