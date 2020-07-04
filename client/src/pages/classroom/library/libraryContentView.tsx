import { CardMedia } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import Void1BackgroundImage from "../../../assets/img/void1_bg.svg";
import CreateDialog from "./createDialog";
import LibraryContentItems from "./libraryContentItems";
import { ContentItem, LibraryContentType } from "../../../types/objectTypes";
import {
    useRestAPI,
} from "../assessments/api/restapi";

const MARKETPLACE_CONTENT: ContentItem[] = [
    {
        published: true,
        contentId: "demo-market-content-id",
        description: "Bada Rhyme 1 is the first step in our ESL curriculum. Young learners can begin their English journey through classic nursery rhymes. Bada Rhyme's key learning areas: Phonological awareness, vocabulary, language, communication, emergent reading and writing skills, social-emotional learning, cognitive development, physical coordination, and STEAM.",
        image: "https://badanamu.com/wp-content/uploads/2019/12/Bada_Rhyme_logo.png",
        link: "#",
        title: "Bada Rhyme 1",
    },
];

interface Props {
    contents: ContentItem[];
    type: LibraryContentType;
}

export default function LibraryContentView() {
    const api = useRestAPI();
    async function fetchLessonMaterials() {
        const payload = await api.getLessonMaterials();
        return payload.lessonMaterials
            .filter(m => m.published)
            .sort((a, b) => b.createdDate - a.createdDate);
    }
    async function fetchLessonPlans() {
        const payload = await api.getLessonPlans();
        return payload.lessonPlans
            .filter(p => p.published)
            .sort((a, b) => b.createdDate - a.createdDate);
    }

    const [contents, setContents] = useState<ContentItem[]>([]);

    useEffect(() => {
        let prepared = true;
        (async () => {
            const plans = await fetchLessonPlans();
            const materials = await fetchLessonMaterials();

            let contents: ContentItem[] = []
            if (prepared) {
                for (const plan of plans) {
                    contents.push({
                        published: plan.published,
                        type: "lesson-plan",
                        contentId: plan.lessonPlanId,
                        title: plan.name,
                        description: plan.description,
                        // image: ZooBackgroundImage,
                        image: "https://zoo.kidsloop.net/822942faa6be02787fbb357cdf4970c9.png",
                        link: "https://zoo.kidsloop.net"
                    })
                }
                for (const material of materials) {
                    contents.push({
                        published: material.published,
                        type: "lesson-material",
                        contentId: material.lessonMaterialId,
                        title: material.name,
                        description: material.description,
                        // image: ZooBackgroundImage,
                        image: "https://zoo.kidsloop.net/822942faa6be02787fbb357cdf4970c9.png",
                        link: material.externalId
                            ? `https://zoo.kidsloop.net/h5p/play/${material.externalId}`
                            : ""
                    })
                }
                setContents(contents);
            }
        })();
        return () => { prepared = false; };
    }, [])

    return (<>
        <Grid item xs={12}>
            {contents.length === 0 ?
                <Grid
                    container
                    direction="column"
                    justify="space-between"
                    alignItems="center"
                    spacing={1}
                >
                    <Grid item xs={12}>
                        <CardMedia
                            component="img"
                            alt="Empty Library"
                            height="140"
                            image={Void1BackgroundImage}
                            title="Empty Library"
                            style={{ objectFit: "contain" }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" align="center">
                            Your library is empty!
                </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption" align="center" component="p">
                            Create or purchase content to get started on your learning adventure.
                </Typography>
                    </Grid>
                    <Hidden lgUp>
                        <Grid item xs={12}>
                            <CreateDialog />
                        </Grid>
                    </Hidden>
                </Grid> :
                <LibraryContentItems contents={contents} type="OwnedContent" />
            }
        </Grid>
        <Grid item xs={12} style={{ padding: "16px 0" }}>
            <Typography variant="caption" color="textSecondary">
                <FormattedMessage id="library_contentMarketTitle" />
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <LibraryContentItems contents={MARKETPLACE_CONTENT} type="Marketplace" />
        </Grid>
    </>)
}
