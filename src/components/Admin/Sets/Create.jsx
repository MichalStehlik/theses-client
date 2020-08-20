import React, {useState, useEffect} from 'react';
import { Formik } from 'formik';
import { Alert, Button, Form, FormTextInput, FormCheckbox, FormRadioGroup, ActionLink, Card, CardContainer} from "../../general";
import {useHistory} from "react-router-dom";
import {useAppContext, SET_TITLE, ADD_MESSAGE} from "../../../providers/ApplicationProvider";
import Axios from 'axios';

const Edit = props => {
    const [{accessToken}, dispatch] = useAppContext();
    const [failed, setFailed] = useState(false);
    const [ok, setOk] = useState(false);
    let history = useHistory();
    useEffect(() => {
        dispatch({type: SET_TITLE, payload: "Vytvoření sady"});
        setFailed(false);
        setOk(false);
    },[dispatch]);
    return (
        <>
        <>
            <ActionLink to="..">Administrace</ActionLink>
            <ActionLink to=".">Seznam</ActionLink>
        </>
        <CardContainer>
            <Card>
        <Formik
            initialValues={{
                name: "",
                year: "",
                active: true,
                template: 0,
                maxGrade: 5,
                requiredGoals: 3,
                requiredOutlines: 3,
            }}
            validate={values=>{
                let errors = {};
                if (!values.name) errors.name = "Vyplňte název";
                if (values.year === "") errors.year = "Vyplňte rok";
                if (values.template === "") errors.template = "Vyberte šablonu";
                if (values.maxGrade === "") errors.maxGrade = "Nastavte nejvyšší známku";
                if (values.requiredGoals === "") errors.requiredGoals = "Nastavte počet požadovaných cílů";
                if (values.requiredOutlines === "") errors.requiredOutlines = "Nastavte počet požadovaných bodů osnovy";
                return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                Axios.post(process.env.REACT_APP_API_URL + "/sets", {
                    Name: values.name,
                    Year: Number(values.year),
                    Active: values.active,
                    Template: Number(values.template),
                    MaxGrade: Number(values.maxGrade),
                    RequiredGoals: Number(values.requiredGoals),
                    RequiredOutlines: Number(values.requiredOutlines)
                }, {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        "Content-Type": "application/json"
                    }
                })
                .then(response => {
                    setOk(true);
                    setFailed(false);
                    dispatch({type: ADD_MESSAGE, text: "Sada byla vytvořena.", variant: "success", dismissible: true, expiration: 3});
                    history.push("/admin/sets");
                })
                .catch(error => {
                    if (error.response)
                        {
                            setFailed(error.response.status);
                        }
                        else
                        {
                            setFailed("Neznámá chyba");
                        }
                        setOk(false);
                })
                .then(()=>{
                    setSubmitting(false); 
                }); 
            }}
        >
            {({isSubmitting, isValid, dirty}) => (
            <Form>
                {(failed !== false) ? <Alert text={"Uložení sady se nepodařilo. (" + failed + ")"}  variant="error" /> : ""}
                {(ok !== false) ? <Alert text={"Uložení sady se podařilo."}  variant="success" /> : ""}
                <FormTextInput name="name" label="Název" placeholder="MP 2021/22" />
                <FormTextInput name="year" label="Rok" type="number" placeholder="2020" />
                <FormCheckbox name="active" label="Aktivní" />
                <FormRadioGroup name="template" label="Šablona" values={{0: "Maturitní práce", 1: "Ročníkové práce"}} />
                <FormTextInput name="maxGrade" label="Škála známek" type="number" placeholder="5" />
                <FormTextInput name="requiredGoals" label="Minimální počet cílů" type="number" placeholder="5" />
                <FormTextInput name="requiredOutlines" label="Minimální počet bodů osnovy" type="number" placeholder="5" />
                <div>
                    <Button type="submit" variant="primary" disabled={!(isValid && dirty) || isSubmitting}>{!isSubmitting ? "Uložit" : "Pracuji"}</Button>
                    <Button onClick={e => {history.push("/admin/sets")}}>Zpět</Button>
                </div>
            </Form>
            )}
        </Formik>
        </Card>
        </CardContainer>
        </>
    );
};

export default Edit;