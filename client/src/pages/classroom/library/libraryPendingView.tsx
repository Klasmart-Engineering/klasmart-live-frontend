import { CardMedia } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import React, { useState, useEffect } from "react";
import Void1BackgroundImage from "../../../assets/img/void1_bg.svg";
import CreateDialog from "./createDialog";
import LibraryContentItems from "./libraryContentItems";
import { ContentItem, LibraryContentType } from "../../../types/objectTypes";
import {
    useRestAPI,
    LessonPlanResponse,
    LessonMaterialResponse,
} from "../assessments/api/restapi";
import ZooBackgroundImage from "../../../assets/img/zoo_banner_web.png";

interface Props {
    contents: ContentItem[];
    type: LibraryContentType;
}

export default function LibraryPendingView() {
    const api = useRestAPI();
    async function fetchLessonMaterials() {
        const payload = await api.getLessonMaterials();
        return payload.lessonMaterials
            .filter(m => !m.published)
            .sort((a, b) => b.createdDate - a.createdDate);
    }
    async function fetchLessonPlans() {
        const payload = await api.getLessonPlans();
        return payload.lessonPlans
            .filter(p => !p.published)
            .sort((a, b) => b.createdDate - a.createdDate);
    }

    const [plans, setPlans] = useState<LessonPlanResponse[]>([]);
    const [materials, setMaterials] = useState<LessonMaterialResponse[]>([]);
    const [contents, setContents] = useState<ContentItem[]>([]);

    useEffect(() => {
        let prepared = true;
        (async () => {
            const plans = await fetchLessonPlans();
            const materials = await fetchLessonMaterials();

            let contents: ContentItem[] = []
            if (prepared) {
                setPlans(plans);
                setMaterials(materials);
                for (const plan of plans) {
                    contents.push({
                        published: plan.published,
                        type: "lesson-plan",
                        contentId: plan.lessonPlanId,
                        title: plan.name,
                        description: plan.description,
                        image: ZooBackgroundImage,
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
                        image: ZooBackgroundImage,
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
                            Create content to get started on your learning adventure.
                </Typography>
                    </Grid>
                    {/* <Hidden lgUp>
                        <Grid item xs={12}>
                            <CreateDialog />
                        </Grid>
                    </Hidden> */}
                </Grid> :
                <LibraryContentItems contents={contents} type="OwnedContent" />
            }
        </Grid>
    </>)
}
