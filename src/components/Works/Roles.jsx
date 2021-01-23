import React, {useState, useEffect, useCallback} from 'react';
import {useAppContext, ADD_MESSAGE} from "../../providers/ApplicationProvider";
import {Loader, Paragraph, CardBody, Table, TableHeader, TableBody, TableRow, TableFooter, HeadCell, DataCell, Alert, CardHeader, Subheading, AddMiniButton, RemoveMiniButton, TableWrapper, Button} from "../general";
import {ADMIN_ROLE, EVALUATOR_ROLE} from "../../configuration/constants";
import {SHOW_ROLES, INVITE_ROLES, ASSIGN_ROLES} from "./Detail";
import LoadedUser from "../common/LoadedUser";
import axios from "axios";
import styled from 'styled-components';

const StyledUsersInRole = styled.nav`
display: flex;
flex-direction: column;
`;

const StyledUserInRole = styled.nav`
display: flex;
flex-direction: row;
width: 100%;
justify-content: space-between;
`;

const UserInRole = ({userId, removeUserAction}) => {
    return (
        <StyledUserInRole>
            <LoadedUser id={userId} />
            <RemoveMiniButton onClick={e => removeUserAction()} />
        </StyledUserInRole>
    )   
}

const UsersInRole = ({work, role, setEditedRole, switchMode, accessToken, removeUserAction, fetchAction}) => {
    const [users, setUsers] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const fetchData = useCallback(() => {
        setIsLoading(true);
        setError(false);
        axios.get(process.env.REACT_APP_API_URL + "/works/" + work + "/roles/" + role.id + "/users",{
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json"
            } 
        })
        .then(response => {
            setUsers(response.data);
        })
        .catch(error => {
            if (error.response) {
                setError({status: error.response.status, text: error.response.statusText});
            }
            else
            {
                setError({status: 0, text: "Neznámá chyba"});
            }         
            setUsers([]);
        });
        setIsLoading(false);
    },[accessToken, work, role]);
    useEffect(()=>{
        fetchData();
    },[work, role, accessToken]);
    if (isLoading)
    {
        return <Loader />;
    }
    else if (error) {
        return <Alert variant="error" text="Došlo k chybě." />;
    }
    else if (users)
    {
        return (
            <StyledUsersInRole>
                {Array.isArray(users) 
                ?
                users.map((item,index)=>(
                    <UserInRole key={index} userId={item.id} removeUserAction={e => {removeUserAction(work, role.id, item.id); fetchAction();}} />
                ))
                : 
                ""
                }
                <AddMiniButton onClick={e => {
                    setEditedRole(role.id);
                    switchMode(ASSIGN_ROLES);
                }} />
            </StyledUsersInRole>
        ) 
    }
    else
    {
        return <Loader />;
    }
}

const Roles = ({id, owner, switchMode, editedRole, setEditedRole, ...rest}) => {
    const [{accessToken, profile}, dispatch] = useAppContext();
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const fetchData = useCallback(() => {
        setIsLoading(true);
        setError(false);
        axios.get(process.env.REACT_APP_API_URL + "/works/" + id + "/roles",{
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json"
            } 
        })
        .then(response => {
            setResponse(response.data);
        })
        .catch(error => {
            if (error.response) {
                setError({status: error.response.status, text: error.response.statusText});
            }
            else
            {
                setError({status: 0, text: "Neznámá chyba"});
            }         
            setResponse([]);
        });
        setIsLoading(false);
    },[accessToken, id]);
    const removeUser = useCallback((work, role, user) => {
        axios.delete(process.env.REACT_APP_API_URL + "/works/" + work + "/roles/" + role + "/users/" + user,{
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json"
            } 
        })
        .then(response => {
            dispatch({type: ADD_MESSAGE, text: "Hodnotitel byl odebrán.", variant: "success", dismissible: true, expiration: 3});
        })
        .catch(error => {
            dispatch({type: ADD_MESSAGE, text: "Při odebírání hodnotitele došlo k chybě.", variant: "error", dismissible: true, expiration: 3});
        });
    },[accessToken, id]);
    useEffect(()=>{
        fetchData();
    },[accessToken]);

    const showRoles = () => {
        if (isLoading) {
            return (
                <HeadCell colSpan="1000"><Loader /></HeadCell>
            );
        }          
        else if (error) {
            return (
                <HeadCell colSpan="1000"><Alert text="Při získávání seznamu rolí došlo k chybě." /></HeadCell>
            );
        } else if (response) {
            return (
                response.map((item,index)=>(
                    <HeadCell key={index}>{item.setRole.name}</HeadCell>
                ))
            );
        } else {
            return (
                <HeadCell colSpan="1000"><Loader /></HeadCell>
            );
        }
    }

    const showAssignedRoles = () => {
        if (isLoading) {
            return (
                <HeadCell colSpan="1000"><Loader /></HeadCell>
            );
        }          
        else if (error) {
            return (
                <HeadCell colSpan="1000"><Alert text="Při získávání seznamu obsazení rolí došlo k chybě." /></HeadCell>
            );
        } else if (response) {
            return (
                response.map((item,index)=>(
                    <DataCell key={index}>
                        <UsersInRole work={id} role={item} switchMode={switchMode} setEditedRole={setEditedRole} accessToken={accessToken} removeUserAction={removeUser} fetchAction={fetchData} />
                    </DataCell>
                ))
            );
        } else {
            return (
                <HeadCell colSpan="1000"><Loader /></HeadCell>
            );
        }
    }

    return (
        <>
        <CardHeader><Subheading>Role a hodnocení</Subheading></CardHeader>
        <TableWrapper>
            <Table width="100%">
                <TableHeader>
                    <TableRow>
                        <HeadCell>Název role</HeadCell>
                        {showRoles()}
                    </TableRow>
                    <TableRow>
                        <HeadCell>Hodnotitel</HeadCell>
                        {showAssignedRoles()}
                    </TableRow>
                </TableHeader>
            </Table>
        </TableWrapper>
        <div>
            <a href={process.env.REACT_APP_API_URL + "/works/" + id + "/application"} target="_blank">Přihláška</a>
        </div>
        </>
    );
}

export default Roles;