import React, {useState, useEffect, useCallback} from 'react';
import { useParams } from "react-router-dom";
import { Alert, Loader } from "../../general";
import {useAppContext} from "../../../providers/ApplicationProvider";
import ContentTable from "./ContentTable";
import axios from "axios";

const CONTENT_DISPLAY = 0;
const CONTENT_ADD_TERM = 1;
const CONTENT_ADD_ROLE = 2;

export const Content = props => {
    const { id } = useParams();
    const [{accessToken}, dispatch] = useAppContext();
    const [contentMode, setContentMode] = useState(CONTENT_DISPLAY);
    const [editedTerm, setEditedTerm] = useState(null);
    const [editedRole, setEditedRole] = useState(null);
    const [termsResponse, setTermsResponse] = useState(null);
    const [rolesResponse, setRolesResponse] = useState(null);
    const [isTermsLoading, setIsTermsLoading] = useState(false);
    const [isRolesLoading, setIsRolesLoading] = useState(false);
    const [termsError, setTermsError] = useState(false);
    const [rolesError, setRolesError] = useState(false);
    const fetchTerms = useCallback(() => {
        setIsTermsLoading(true);
        setTermsError(false);
        axios.get(process.env.REACT_APP_API_URL + "/sets/" + id + "/terms",{
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json"
            } 
        })
        .then(response => {
            setTermsResponse(response.data);
        })
        .catch(error => {
            if (error.response) {
                setTermsError({status: error.response.status, text: error.response.statusText});
            }
            else
            {
                setTermsError({status: 0, text: "Neznámá chyba"});
            }         
            setTermsResponse([]);
        });
        setIsTermsLoading(false);
    },[accessToken, id]);    
    const fetchRoles = useCallback(() => {
        setIsRolesLoading(true);
        setRolesError(false);
        axios.get(process.env.REACT_APP_API_URL + "/sets/" + id + "/roles",{
            headers: {
                Authorization: "Bearer " + accessToken,
                "Content-Type": "application/json"
            } 
        })
        .then(response => {
            setRolesResponse(response.data);
        })
        .catch(error => {
            if (error.response) {
                setRolesError({status: error.response.status, text: error.response.statusText});
            }
            else
            {
                setRolesError({status: 0, text: "Neznámá chyba"});
            }         
            setRolesResponse([]);
        });
        setIsRolesLoading(false);
    },[accessToken, id]); 
    useEffect(()=>{
        fetchTerms();
        fetchRoles();
    },[]);
    if (isTermsLoading || isRolesLoading) {
        return <Loader size="2em"/>;
    } else if (termsError !== false) {
        switch (termsError.status)
        {
            case 400: return <Alert text={"Nesprávný formát identifikátoru nebo jiná chyba požadavku"} variant="error"/>;
            case 404: return <Alert text={"Neznámý námět"} variant="error"/>;
            default: return <Alert text={termsError.text + " (" + termsError.status + ")"} variant="error"/>;
        }
    } else if (rolesError !== false) {
        switch (rolesError.status)
        {
            case 400: return <Alert text={"Nesprávný formát identifikátoru nebo jiná chyba požadavku"} variant="error"/>;
            case 404: return <Alert text={"Neznámý námět"} variant="error"/>;
            default: return <Alert text={rolesError.text + " (" + rolesError.status + ")"} variant="error"/>;
        }
    } else if (termsResponse && rolesResponse) {
        switch (contentMode)
        {
            case (CONTENT_ADD_TERM) :  return <p>Add term</p>;
            case (CONTENT_ADD_ROLE) :  return <p>Add role</p>;
            default : return <ContentTable terms={termsResponse} roles={rolesResponse} />;
        }
    } else {
        return <Loader size="2em" />;
    };
};

export default Content;