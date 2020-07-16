import React from "react";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import SkipNextTwoToneIcon from "@material-ui/icons/SkipNextTwoTone";
import SkipPreviousTwoToneIcon from "@material-ui/icons/SkipPreviousTwoTone";
import { LessonMaterial } from "../../lessonMaterialContext";
import IconButton from "@material-ui/core/IconButton";


interface Props {
    contentIndex: number
    materials: LessonMaterial[]
    setContentIndex: React.Dispatch<React.SetStateAction<number>>
}

export function MaterialSelection(props: Props) {
    const {contentIndex, materials, setContentIndex} = props;
    return (
        <Grid container direction="row">
            <Grid item xs={10} style={{ paddingRight: "10px" }}>
                <Select value={contentIndex} fullWidth disabled={materials.length == 0} onChange={(e) => {
                    if (materials.length === 0) { return; }
                    const index = e.target.value as number;
                    setContentIndex(index);
                }}>
                    {materials.map(({ name, url }, i) => <MenuItem value={i} key={`${name}-${url}`}>{name}</MenuItem>)}
                </Select>
            </Grid>
            <Grid item xs={1}>
                <IconButton aria-label="delete" disabled={materials.length == 0} color="primary" onClick={() => {
                    if (materials.length === 0) { return; }
                    const newIndex = contentIndex ? Math.max(0, contentIndex - 1) : 0;
                    setContentIndex(newIndex);
                }}>
                    <SkipPreviousTwoToneIcon />
                </IconButton>
            </Grid>
            <Grid item xs={1}>
                <IconButton aria-label="next" disabled={materials.length == 0} color="primary" onClick={() => {
                    if (materials.length === 0) { return; }
                    const newIndex = contentIndex !== undefined ? Math.min(materials.length - 1, contentIndex + 1) : 0;
                    setContentIndex(newIndex);
                }}>
                    <SkipNextTwoToneIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
}