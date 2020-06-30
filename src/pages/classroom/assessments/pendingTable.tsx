import React, { forwardRef, useState } from "react";
import MaterialTable, { Icons } from "material-table";
import Paper from "@material-ui/core/Paper";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

import PendingDialog from "./pendingDialog";

const tableIcons: Icons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

interface TableProps {
    columns: any[]
    data: any[]
    pageSize?: number
}

export interface TableRow {
    assId: string
    title: string
    createdDate: string
}

export default function PendingTable(props: TableProps) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string>();

    const handleOnRowClick = (assId: string) => {
        setSelected(assId);
        setOpen(true);
    }

    const handleOnClose = () => { setOpen(false); }

    return (
        <>
            <MaterialTable
                components={{
                    Container: props => <Paper {...props} elevation={1} />
                }}
                title=""
                icons={tableIcons}
                columns={props.columns}
                data={props.data}
                options={{
                    headerStyle: {
                        fontWeight: 1000
                    },
                    searchFieldStyle: {
                        color: "#0E78D5"
                    },
                    pageSize: props.pageSize ? props.pageSize : 5,

                }}
                onRowClick={((evt, selectedRow) => handleOnRowClick(selectedRow.assId))}
            />
            {selected ? <PendingDialog open={open} onClose={handleOnClose} assId={selected} /> : null}
        </>
    )
}
