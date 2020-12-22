import React, {useState, useEffect, useCallback} from 'react';
import {useAppContext, ADD_MESSAGE} from "../../providers/ApplicationProvider";
import {Loader, Paragraph, CardBody, Table, TableHeader, TableBody, TableRow, TableFooter, HeadCell, DataCell, Alert } from "../general";
import {ADMIN_ROLE, EVALUATOR_ROLE} from "../../configuration/constants";
import axios from "axios";
import { logRoles } from '@testing-library/react';

const Roles = ({id, ...rest}) => {
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
    useEffect(()=>{fetchData();},[accessToken]);

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
                    <HeadCell key={index}></HeadCell>
                ))
            );
        } else {
            return (
                <HeadCell colSpan="1000"><Loader /></HeadCell>
            );
        }
    }

    return (
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
    );
}

export default Roles;