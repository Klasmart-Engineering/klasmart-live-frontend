import Grid from "@material-ui/core/Grid";
import React from "react";
import LibraryContentCard from "./libraryContentCard";
import { ContentItem, LibraryContentType } from "../../../types/objectTypes";

interface Props {
    contents: ContentItem[];
    type: LibraryContentType;
}

export default function LibraryContentItems(props: Props) {
    const { contents, type } = props;
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
                    contents.map((content) => {
                        return (
                            <Grid
                                key={`item-${content.contentId}`}
                                item
                                xs={6} sm={4} md={3}
                                style={{ textAlign: "center" }}
                            >
                                <LibraryContentCard
                                    content={content}
                                    type={type}
                                />
                            </Grid>
                        );
                    })
                }
            </Grid>
        </>
    );
}