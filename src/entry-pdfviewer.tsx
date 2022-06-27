import Loading from './components/loading';
import PdfPagesIndicator from './components/pdf/pdfPagesIndicator/PdfPagesIndicator';
import { THEME_COLOR_BACKGROUND_PAPER } from './config';
import {
    getDefaultLanguageCode,
    getLanguage,
} from './utils/locale';
import { PdfActions } from "@/components/pdf/pdfActions/pdfActions";
import { ZoomProps } from "@/components/pdf/pdfImages/PdfImage";
import PdfImages from '@/components/pdf/pdfImages/PdfImages';
import { NoItemList } from "@/utils/noItemList";
import {
    getPdfMetadata,
    PDFMetadataDTO,
} from '@/utils/pdfUtils';
import {
    Box,
    Grid,
    makeStyles,
} from "@material-ui/core";
import { FilePdf as FilePdfIcon } from "@styled-icons/bootstrap/FilePdf";
import clsx from 'clsx';
import React,
{
    useEffect,
    useState,
} from 'react';
import ReactDOM from 'react-dom';
import {
    FormattedMessage,
    RawIntlProvider,
} from 'react-intl';

enum ZoomTypes {
  WIDTH_FIT = `width-fit`,
  HEIGHT_FIT = `height-fit`,
  ZOOM_IN = `zoom-in`,
  ZOOM_OUT = `zoom-out`,
}
export { ZoomTypes };

const SCROLLBAR_WIDTH = 10;
const MAX_SCALE = 4; // 4 === 400%
const INITIAL_MAX_SCALE = 2000;
const ZOOM_VALUE = 60;
const INITIAL_MIN_SCALE = 300;

const useStyles = makeStyles((theme) => ({
    pdfActionsContainer: {
        marginTop: theme.spacing(2),
    },
    actionsGridItem: {
        color: `transparent`,
    },
}));

export interface PDF {
  path: string;
  metadata: PDFMetadataDTO;
}

function PdfViewer () {
    const url = new URL(window.location.href);
    const pdfPath = url.searchParams.get(`pdf`) || ``;
    const pdfEndpoint = url.searchParams.get(`pdfendpoint`) || ``;
    const [ pdfError, setPdfError ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ visiblePages, setVisiblePages ] = useState([ 1 ]);
    const [ currentZoomType, setCurrentZoomType ] = useState(ZoomTypes.WIDTH_FIT);
    const [ searchPage, setSearchPage ] = useState(1);
    const [ maxScale, setMaxScale ] = useState<number>(INITIAL_MAX_SCALE);
    const [ minScale, setMinScale ] = useState<number>(INITIAL_MIN_SCALE);
    const [ disabledActions, setDisabledActions ] = useState<ZoomTypes[]>([]);
    const [ firstImageLoaded, setFirstImageLoaded ] = useState(false);
    const [ pdf, setPdf ] = useState<PDF>({
        path: pdfPath,
        metadata: {
            totalPages: 0,
        },
    });
    const classes = useStyles();
    const locale = getLanguage(getDefaultLanguageCode());
    const currentPage = visiblePages.length ? Math.min(...visiblePages) : 1;
    const containerRef = document.getElementById(`app-pdf`);
    const InitialWidth: number = containerRef?.offsetWidth || 0;
    const [ scale, setScale ] = useState(InitialWidth);

    const [ zoomProps, setZoomProps ] = useState<ZoomProps>({});

    useEffect(() => {
        setDisabledActions([]);
        if(scale >= maxScale)
        {
            setDisabledActions(prev =>[ ...prev, ZoomTypes.ZOOM_IN ]);
        }
        if(scale <= minScale)
        {
            setDisabledActions(prev =>[ ...prev, ZoomTypes.ZOOM_OUT ]);
        }

        if (currentZoomType === ZoomTypes.HEIGHT_FIT && containerRef?.offsetHeight) {
            const elm = document.querySelector<HTMLElement>(`.pdfImage:first-child`)!;
            let newWidth = elm.offsetWidth;
            newWidth = newWidth - SCROLLBAR_WIDTH;
            setScale(newWidth);
            setMinScale(newWidth);
            handleZoom(ZoomTypes.HEIGHT_FIT);
            const newHeight: number = containerRef?.offsetHeight || 0;
            setZoomProps(() => ({
                height: newHeight,
            }));
        } else if (currentZoomType === ZoomTypes.WIDTH_FIT && containerRef?.offsetWidth) {
            let newWidth: number = containerRef?.offsetWidth || 0;
            newWidth = newWidth - SCROLLBAR_WIDTH;
            if(maxScale === INITIAL_MAX_SCALE)
            {
                setMaxScale(newWidth * MAX_SCALE);
            }
            setScale(newWidth);
            handleZoom(ZoomTypes.WIDTH_FIT);
            setZoomProps(() => ({
                width: newWidth,
            }));
        } else {
            setZoomProps(() => ({
                width: scale,
            }));
        }
    }, [
        currentZoomType,
        scale,
        maxScale,
    ]);

    const handleZoom = (zoomType: ZoomTypes) => {
        setCurrentZoomType(zoomType);
        setDisabledActions([]);
        switch(zoomType){
        case ZoomTypes.ZOOM_IN:
            if (scale < maxScale) {
                setScale(scale + ZOOM_VALUE);
            }
            break;
        case ZoomTypes.ZOOM_OUT:
            if (scale >= minScale) {
                const elm = document.querySelector<HTMLElement>(`.pdfImage:first-child`)!;
                if((elm.offsetHeight - 60) < (containerRef?.offsetHeight || 0)) {
                    setCurrentZoomType(ZoomTypes.HEIGHT_FIT);
                }
                if((scale - 60) < minScale) {
                    setCurrentZoomType(ZoomTypes.HEIGHT_FIT);
                } else {
                    setScale(scale - ZOOM_VALUE);
                }
            }
            break;
        case ZoomTypes.HEIGHT_FIT:
            setDisabledActions(prev =>[ ...prev, ZoomTypes.ZOOM_OUT ]);
            break;
        default:
            break;
        }
    };

    useEffect(() => {
        setLoading(true);
        getPdfMetadata(url.searchParams.get(`pdf`) || ``, pdfEndpoint)
            .then((metadata: PDFMetadataDTO) => {
                if (metadata.status !== undefined && metadata.status === `500`) {
                    setLoading(false);
                    setPdfError(true);
                } else if (Object.keys(metadata).length === 0) {
                    setPdfError(true);
                } else {
                    setPdf({
                        path: pdfPath,
                        metadata,
                    });
                    setPdfError(false);
                }
            })
            .catch(err => { setPdfError(true); })
            .finally(() => { setLoading(false); });
    }, []);

    if (loading) {
        return (<Loading loaderColor={THEME_COLOR_BACKGROUND_PAPER} />);
    }

    const imageLoaded = (value: boolean) => {
        setFirstImageLoaded(value);
    };

    return (
        <RawIntlProvider value={locale}>
            <Box
                position="fixed"
                zIndex="9"
                width="100%"
                textAlign="center"
                display="flex"
                justifyContent="center"
                alignItems="center"
                gridGap={10}
                height={!pdfError ? `auto` : `100vh`}
            >
                {pdfError ?
                    <NoItemList
                        icon={<FilePdfIcon />}
                        text={<FormattedMessage
                            id="content.pdf.notAvailable"
                        />}
                    />
                    : (
                        <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            justifyContent="center"
                            className={classes.pdfActionsContainer}
                        >

                            <Grid
                                item
                            >
                                <PdfPagesIndicator
                                    current={currentPage}
                                    total={pdf.metadata.totalPages}
                                    searchPage={searchPage}
                                    setSearchPage={setSearchPage}
                                />
                            </Grid>
                            {firstImageLoaded && (
                                <Grid
                                    item
                                    className={clsx(classes.actionsGridItem, `rr-block`)}
                                >
                                    <PdfActions
                                        actionHandler={handleZoom}
                                        disabledActions={disabledActions}
                                    />
                                </Grid>)}

                        </Grid>
                    )}

            </Box>
            {!pdfError && <PdfImages
                imageLoaded={imageLoaded}
                zoomProps={zoomProps}
                pdf={pdf}
                setVisiblePages={setVisiblePages}
            />}

        </RawIntlProvider>
    );
}

ReactDOM.render(<PdfViewer />, document.getElementById(`app-pdf`));
