import Grid from "@material-ui/core/Grid";
import CompleteIcon from "@material-ui/icons/Done";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useState, useEffect } from "react";

import LearningOutcomeTable, { TableRow } from "./learningOutcomeTable";
import { LearningOutcomeResponse } from "../../../api/restapi";
import { TableColumns }from "../../../types/objectTypes";

const TABLE_COLUMN_MOBILE = [
    {
        title: "Title",
        field: "title",
        headerStyle: { minWidth: "180px" }
    },
    {
        title: "Published",
        field: "published",
        cellStyle: { color: "#0E78D5" },
        type: "numeric"
    }
];

const TABLE_COLUMN: TableColumns = [
    {
        title: "Title",
        field: "title",
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
        title: "Updated on",
        field: "updatedDate",
        headerStyle: { textAlign: "right" },
        cellStyle: { textAlign: "right" },
    },
];

interface Props {
    data: LearningOutcomeResponse[];
}

export default function AssessmentsLibraryView(props: Props) {
    const { data } = props;

    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const [columns, setColumns] = useState<TableColumns>(TABLE_COLUMN);
    const [rows, setRows] = useState<TableRow[]>([]);

    useEffect(() => {
        const tmpRows: TableRow[] = [];
        for (const lo of data) {
            tmpRows.push({
                loId: lo.loId,
                title: lo.title,
                published: <Grid>{lo.published ? <CompleteIcon /> : null}</Grid>,
                assumed: <Grid>{lo.assumed ? <CompleteIcon /> : null}</Grid>,
                updatedDate: new Date(lo.updatedDate).toLocaleString()
            });
        }
        setRows(tmpRows);
    }, []);

    useEffect(() => {
        if (isSmDown) {
            setColumns(TABLE_COLUMN_MOBILE);
        } else {
            setColumns(TABLE_COLUMN);
        }
    }, [isSmDown]);

    return (
        <Grid container>
            <Grid item xs={12}>
                <LearningOutcomeTable
                    columns={columns}
                    data={rows.map(data => Object.assign({}, data))}
                />
            </Grid>
        </Grid>
    );
}
