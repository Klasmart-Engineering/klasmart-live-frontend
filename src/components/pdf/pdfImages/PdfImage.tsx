
import Loading from "@/components/loading";
import {
    Box,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core";
import React,
{
    useEffect,
    useRef,
    useState,
} from "react";
import { useInViewport } from "react-in-viewport";
import { LazyLoadImage } from 'react-lazy-load-image-component';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: `relative`,
        marginBottom: theme.spacing(1),
    },
    image: {
        minWidth: 500,
        minHeight: 500,
        width: `100%`,
        height: `auto`,
    },
}));

interface Props {
    pageId: number;
    image: string;
    setVisiblePages: React.Dispatch<React.SetStateAction<number[]>>;
}

function PdfImage (props: Props) {
    const classes = useStyles();
    const [ loading, setLoading ] = useState(true);

    const {
        image,
        pageId,
        setVisiblePages,
    } = props;
    const theme = useTheme();

    const pageRef = useRef<HTMLDivElement>(null);
    const { inViewport } = useInViewport(pageRef);

    useEffect(() => {
        if(inViewport){
            setVisiblePages((visiblePages: number[]) => {
                if(visiblePages.find(page => page === pageId)){
                    return [ ...visiblePages ];
                }
                else{
                    return [ ...visiblePages, pageId ];
                }
            });
        }else{
            setVisiblePages((visiblePages: number[]) => visiblePages.filter((page) => page !== pageId));
        }
    }, [ inViewport ]);

    return (
        <div
            ref={pageRef}
            className={classes.root}
            data-page-num={pageId}
            id={`pdf-page-${pageId}`}
        >
            {loading && (
                <Box
                    position="absolute"
                    width="100%"
                    height="100%"
                    top={0}
                    left={0}
                    bgcolor={theme.palette.common.white}
                >
                    <Loading messageId="loading" />
                </Box>
            )}
            <LazyLoadImage
                alt={image}
                src={image}
                className={classes.image}
                afterLoad={() => setLoading(false)}
                style={{
                    height: loading ? `0` : `auto`,
                }}
            />
        </div>
    );
}

export default PdfImage;
