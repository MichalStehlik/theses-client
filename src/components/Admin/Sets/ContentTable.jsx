import React, {useState, useMemo, useCallback, useEffect} from 'react';
import { Subheading, CardHeader, CardBody,  Table, TableHeader, TableBody, TableRow, DataCell, HeadCell, RemoveMiniButton, AddMiniButton, EditMiniButton } from "../../general";

const ContentTable = props => {
    return (
        <>
        <CardHeader>
            <Subheading>Termíny a role</Subheading>
        </CardHeader>
        <CardBody>
        <Table width="100%">
            <TableHeader>
                <TableRow>
                    <HeadCell rowSpan="2">Termíny</HeadCell>
                    <HeadCell colSpan="1000">Role</HeadCell>
                </TableRow>
                <TableRow>
                    {props.roles.map((item, index) => (<HeadCell key={index}>{item.name}<br /><EditMiniButton /><RemoveMiniButton /></HeadCell>))}
                    <HeadCell horizontal="center"><AddMiniButton /></HeadCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {props.terms.map((item, index) => (
                    <TableRow>
                        <HeadCell key={index}>{item.name}</HeadCell>
                    </TableRow>
                ))}
                <TableRow>
                    <HeadCell horizontal="center"><AddMiniButton /></HeadCell>
                    <DataCell colSpan="1000"></DataCell>
                </TableRow>
            </TableBody>
        </Table>
        </CardBody>
        </>
    )
}

export default ContentTable;