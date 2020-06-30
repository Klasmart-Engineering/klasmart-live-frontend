import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { StandardTextFieldProps } from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import StyledTextField from "./textfield";

interface Props extends StandardTextFieldProps {
    type: "single" | "multiple";
    label: string;
    options: string[];
    value: string | string[],
    onChange: any;
}

const useStyles = makeStyles(() => ({
    root: {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1896ea", // default
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1896ea", // hovered
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#c9caca", // focused
        }
    }
}));

export default function StyledComboBox(props: Props) {
    const { type, label, options, value, onChange, ...other } = props;
    const classes = useStyles();

    if (type === "single") {
        return (
            <Autocomplete

                className={classes.root}
                options={options}
                getOptionLabel={option => option}
                onChange={onChange}
                inputValue={value as string} // If it already have value, value will be autofilled by inputValue
                renderInput={(params) =>
                    <div ref={params.InputProps.ref}>
                        <StyledTextField
                            {...other}

                            {...params}
                            fullWidth
                            required
                            label={label}
                            placeholder="Please Select"
                            value={value}
                        />
                    </div>
                }
            />
        )
    } else {
        return (
            <Autocomplete
                className={classes.root}
                multiple
                freeSolo
                limitTags={2}
                options={options}
                // getOptionLabel={option => option}
                ListboxProps={{
                    classes: {
                        color: "#1896ea",
                    }
                }}
                onChange={onChange}
                // defaultValue={["a", "b", "c"]} // If it already have value, value will be autofilled by inputValue
                renderTags={
                    (value: string[], getTagProps) =>
                        value.map((option: string, index: number) =>
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        )
                }
                renderInput={(params) =>
                    <div ref={params.InputProps.ref}>
                        <StyledTextField
                            {...params}
                            // {...other}
                            fullWidth
                            required
                            label={label}
                            value={value}
                        />
                    </div>
                }
            />
        )
    }
}
