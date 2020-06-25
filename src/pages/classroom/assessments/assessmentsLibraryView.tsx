import Grid from "@material-ui/core/Grid";
import CompleteIcon from '@material-ui/icons/Done';
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { useState, useEffect } from "react";

import LearningOutcomeTable, { TableRow } from "./learningOutcomeTable";
import { useRestAPI, LearningOutcomeResponse } from "./api/restapi";

const TABLE_COLUMN_MOBILE = [
    {
        title: "Title",
        field: "title",
        headerStyle: { minWidth: "180px" } // TODO
    },
    {
        title: "Published",
        field: "published",
        cellStyle: { color: "#0E78D5" },
        type: "numeric"
    }
    // { title: "", field: "actions", type: "numeric" },
];

const TABLE_COLUMN = [
    {
        title: "Title",
        field: "title",
        // headerStyle: { width: "50%" } // TODO
    },
    {
        title: "Assumed",
        field: "assumed",
        headerStyle: { textAlign: "center" },
        cellStyle: { color: "#0E78D5", textAlign: "center" }
    },
    {
        title: "Published",
        field: "published",
        headerStyle: { textAlign: "center" },
        cellStyle: { color: "#0E78D5", textAlign: "center" }
    },
    {
        title: "Created on",
        field: "createdDate",
        type: "numeric",
        headerStyle: { minWidth: "200px" }, // TODO
    },
    // { title: "", field: "actions", type: "numeric" },
];

export default function AssessmentsLibraryView() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const api = useRestAPI();

    const [columns, setColumns] = useState<any[]>(TABLE_COLUMN);
    const [LOs, _] = useState<LearningOutcomeResponse[]>([]);
    const [rows, setRows] = useState<TableRow[]>([]);

    async function fetchLOs() {
        const payload = await api.getLearningOutcomes();
        return payload.learningOutcomes.sort((a, b) => b.createdDate - a.createdDate);
    }

    useEffect(() => {
        if (isMobile) {
            setColumns(TABLE_COLUMN_MOBILE);
        } else {
            setColumns(TABLE_COLUMN);
        }
    }, [isMobile])

    useEffect(() => {
        let prepared = true;

        (async () => {
            const los = await fetchLOs();

            let tmpRows: TableRow[] = [];
            for (const lo of los) {
                tmpRows.push({
                    loId: lo.loId,
                    title: lo.title,
                    published: <Grid>{lo.published ? <CompleteIcon /> : null}</Grid>,
                    assumed: <Grid>{lo.assumed ? <CompleteIcon /> : null}</Grid>,
                    createdDate: new Date(lo.createdDate).toLocaleString(),
                    // actions: <TableActions loId={lo.loId} loTitle={lo.title} published={lo.published} />
                })
            }

            if (prepared) { setRows(tmpRows); }
        })();

        return () => { prepared = false; };
    }, [LOs])

    return (
        <Grid container>
            <Grid item xs={12}>
                <LearningOutcomeTable
                    columns={columns}
                    pageSize={isMobile ? 3 : 5} // TODO: not working
                    data={rows.map(data => Object.assign({}, data))}
                />
            </Grid>
        </Grid>
    );
}
