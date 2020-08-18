import React, {useEffect} from 'react';
import { PageTitle } from "./general";
import {useAppContext, SET_TITLE} from "../providers/ApplicationProvider";

const Home = props => {
    const [,dispatch] = useAppContext();
    useEffect(()=>{ dispatch({type: SET_TITLE, payload: "Úvodní stránka"}); },[dispatch]);
    return (<PageTitle>Dlouhodobé práce</PageTitle>);
}

export default Home;