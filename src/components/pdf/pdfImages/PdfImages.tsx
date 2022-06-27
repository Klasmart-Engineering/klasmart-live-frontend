
import PdfImage,
{ ZoomProps } from "./PdfImage";
import { PDF } from "@/entry-pdfviewer";
import { Box } from "@material-ui/core";
import React,
{
    useEffect,
    useState,
} from "react";

interface Props {
    pdf: PDF;
    setVisiblePages: React.Dispatch<React.SetStateAction<number[]>>;
    zoomProps: ZoomProps;
    imageLoaded:(value:boolean)=>void
}

function PdfImages (props: Props) {
    const {
        pdf,
        setVisiblePages,
        zoomProps,
        imageLoaded
    } = props;
    const url = new URL(window.location.href);
    const pdfEndpoint = url.searchParams.get(`pdfendpoint`) || ``;
    const [ images, setImages ] = useState<string[]>([]);

    const handleImagesFromApi = () => {
        const imagesArr = [];
        for (let i = 1; i < pdf.metadata.totalPages + 1; i++) {
            imagesArr.push(`${pdfEndpoint}/v2${pdf.path}/page/${i}`);
        }
        setImages(imagesArr);
    };

    useEffect(() => {
        handleImagesFromApi();
    }, []);

    return (
        <Box
            p={1}
            id="pdf-pages"
        >
            {images.map((image: string, i: number) => (
                <PdfImage
                    key={image}
                    imageLoaded={imageLoaded}
                    setVisiblePages={setVisiblePages}
                    pageId={i+1}
                    image={image}
                    zoomProps={zoomProps}
                />
            ))}
        </Box>
    );
}

export default PdfImages;
