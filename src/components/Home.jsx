import React, {useEffect} from 'react';
import styled from 'styled-components';
import { PageTitle, Button } from "./general";
import {useAppContext, SET_TITLE} from "../providers/ApplicationProvider";

const HomeLayoutWrapper = styled.div`
display: grid;
grid-template-areas: "title account" "search search" "overview overview";
grid-template-columns: 1fr auto;
grid-template-rows: auto auto;
`;

const StyledPageTitle = styled.div`
grid-area: title;
`;

const StyledAccountButton = styled.div`
grid-area: account;
`;

const AccountButton = props => {
    const [{accessToken, userManager}] = useAppContext();
    return (
        <StyledAccountButton>
        {accessToken ? <Button onClick={() => {userManager.signoutRedirect()}}>Odhlásit</Button> : <Button onClick={() => {userManager.signinRedirect()}}>Přihlásit</Button>}
        </StyledAccountButton>
    ); 
}

const Home = props => {
    const [,dispatch] = useAppContext();
    useEffect(()=>{ dispatch({type: SET_TITLE, payload: "Úvodní stránka"}); },[dispatch]);
    return (
        <HomeLayoutWrapper>
            <StyledPageTitle>
                <PageTitle>Dlouhodobé práce</PageTitle>
            </StyledPageTitle>
            <AccountButton />
        </HomeLayoutWrapper>
    );
}

export default Home;