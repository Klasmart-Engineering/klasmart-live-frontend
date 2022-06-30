
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
        display: `block`,
        textAlign: `center`,
    },
    loadingContainer: {
        margin: `0 auto`,
        minHeight: `100vh`,
    },
}));

interface ZoomProps {
    height?: string | number;
    width?: string | number;
}
export { ZoomProps };
interface Props {
    pageId: number;
    image: string;
    setVisiblePages: React.Dispatch<React.SetStateAction<number[]>>;
    zoomProps: ZoomProps;
    imageLoaded: (value: boolean) => void;
}

function PdfImage (props: Props) {
    const classes = useStyles();
    const [ loading, setLoading ] = useState(true);

    const {
        image,
        pageId,
        setVisiblePages,
        zoomProps,
        imageLoaded,
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
            <Box
                className={classes.loadingContainer}
            >
                {loading && (

                    <Loading messageId="loading" />

                )}
                <LazyLoadImage
                    alt={image}
                    src={image}
                    className="pdfImage"
                    afterLoad={() => {setLoading(false); imageLoaded(true);}}
                    style={zoomProps}
                />
            </Box>
        </div>
    );
}

export default PdfImage;
