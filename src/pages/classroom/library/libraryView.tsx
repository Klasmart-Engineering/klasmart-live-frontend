import Grid from "@material-ui/core/Grid";
import React from "react";
import ZooBackgroundImage from "../../../assets/img/zoo_banner_web.png";
import { ContentItem } from "../../../types/objectTypes";
import LibraryContentCard from "./libraryContentCard";

export default function LibraryView() {

    const MENU_ITEMS: ContentItem[] = [
        {
            description: "In collaboration with The Zoological Society of East Anglia, join an interactive virtual world of animal fun and learning through live and self-paced classes.",
            image: ZooBackgroundImage,
            link: "http://0.0.0.0:8082",
            title: "Badanamu Zoo",
        },
        {
            description: "In collaboration with The Zoological Society of East Anglia, join an interactive virtual world of animal fun and learning through live and self-paced classes.",
            image: ZooBackgroundImage,
            link: "#",
            title: "Badanamu Zoo",
        },
    ];

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
                    MENU_ITEMS.map((menuItem) => {
                        return (
                            <Grid
                                key={`menuItem-${menuItem.title}`}
                                item
                                xs={6} sm={4} md={3}
                                style={{ textAlign: "center" }}
                            >
                                <LibraryContentCard content={menuItem}/>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </>
    );
}
