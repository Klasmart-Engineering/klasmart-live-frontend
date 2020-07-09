import Grid from "@material-ui/core/Grid";
import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useRestAPI, AssessmentResponse } from "./api/restapi";
import CompletedTable, { TableRow } from "./completedTable";

const TABLE_COLUMN_MOBILE = [
    {
        title: "Title",
        field: "title",
    }
]

const TABLE_COLUMN = [
    {
        title: "Title",
        field: "title",
    },
    {
        title: "Completed on",
        field: "completedDate",
        type: "numeric",
    }
];

export default function AssessmentsCompletedView() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const api = useRestAPI();

    const [columns, setColumns] = useState<any[]>(TABLE_COLUMN);
    const [assessments, _] = useState<AssessmentResponse[]>([]);
    const [rows, setRows] = useState<TableRow[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);

    async function fetchCompletedAssessments() {
        const payload = await api.getAssessments();
        return payload.assessments
            .sort((a, b) => b.createdDate - a.createdDate)
            .filter(ass => ass.state === 3 && ass.published);
    }

    useEffect(() => {
        let prepared = true;

        (async () => {
            const assessments = await fetchCompletedAssessments();

            const tmpRows: TableRow[] = [];
            for (const ass of assessments) {
                tmpRows.push({
                    assId: ass.assId,
                    title: ass.name,
                    completedDate: new Date(ass.updatedDate).toLocaleString()
                })
            }

            if (prepared) { setRows(tmpRows); }
        })();

        return () => { prepared = false; };
    }, [])

    useEffect(() => {
        if (isMobile) {
            setColumns(TABLE_COLUMN_MOBILE); setPageSize(3);
        } else {
            setColumns(TABLE_COLUMN); setPageSize(5);
        }
    }, [isMobile])

    return (
        <Grid container>
            <Grid item xs={12}>
                <CompletedTable
                    columns={columns}
                    pageSize={pageSize}
                    data={rows.map(data => Object.assign({}, data))}
                />
            </Grid>
        </Grid>
    );
}
