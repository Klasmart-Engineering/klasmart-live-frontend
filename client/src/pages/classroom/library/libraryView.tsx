import Grid from "@material-ui/core/Grid";
import React from "react";
import { ContentItem, LibraryContentType } from "../../../types/objectTypes";
import LibraryContentCard from "./libraryContentCard";

interface Props {
    content: ContentItem[];
    type: LibraryContentType;
}

export default function LibraryView(props: Props) {
    const { content, type } = props;

    return (
        <>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="stretch"
                spacing={1}
            >
                {
                    content.map((item) => {
                        return (
                            <Grid
                                key={`item-${item.title}`}
                                item
                                xs={6} sm={4} md={3}
                                style={{ textAlign: "center" }}
                            >
                                <LibraryContentCard content={item} type={type} />
                            </Grid>
                        );
                    })
                }
            </Grid>
        </>
    );
}
