import React, {useEffect, useState, useContext} from 'react';
import styled, {ThemeContext} from 'styled-components';
import { PageTitle, Button } from "./general";
import NavigationLink from "./common/NavigationLink";
import {useAppContext, SET_TITLE} from "../providers/ApplicationProvider";
import SearchBar from "./SearchBar";
import FoundItems from "./FoundItems";

const TopPanel = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    box-sizing: border-box;
    backdrop-filter: blur(10px);
    background-color: rgba(100,100,100,.1);
`;

const TitleMenu = styled.div`
    display: flex;
`;

const StyledTitleMenuItem = styled(NavigationLink)`
    padding: 5px 5px 5px 5px;
    justify-content: flex-start;
`;

const TitleMenuItem = props => {
    let {icon, text, ...rest} = props;
    return <StyledTitleMenuItem {...rest}>{icon}<span>{text}</span></StyledTitleMenuItem>;
}

const TitleContainer = styled.div`
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    height: 100%;
`;

const TitleBlock = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const Home = props => {
    const [{accessToken, userManager},dispatch] = useAppContext();
    const [searchResults, setSearchResults] = useState([]);
    const themeContext = useContext(ThemeContext);
    useEffect(()=>{ dispatch({type: SET_TITLE, payload: "Úvodní stránka"}); },[dispatch]);
    return (
        <>
            <TopPanel>
                <SearchBar setSearchResults={setSearchResults} />
                {accessToken 
                ? <Button outline variant="light" onClick={() => {userManager.signoutRedirect()}} >Odhlásit</Button> 
                : <Button outline variant="light" onClick={() => {userManager.signinRedirect()}} >Přihlásit</Button>}
            </TopPanel>
            <TitleContainer>
            {searchResults.length > 0
            ?
            <>
            <FoundItems items={searchResults} />
            </>
            :
            <TitleBlock>
                <PageTitle>Dlouhodobé práce</PageTitle>
                <TitleMenu>
                <TitleMenuItem to="/ideas" text="Náměty"/>
                <TitleMenuItem to="/works" text="Práce"/>
                <TitleMenuItem to="/users" text="Uživatelé"/>
                </TitleMenu>
                <TitleMenu>
                <TitleMenuItem to="/overviews" text="Souhrny"/>
                <TitleMenuItem to="/evaluation" text="Hodnocení"/>
                <TitleMenuItem to="/admin" text="Administrace"/>
                </TitleMenu>
            </TitleBlock>
            }
            </TitleContainer>
        </>
    );
}

export default Home;