
import PdfImage from "./PdfImage";
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
}

function PdfImages (props: Props) {
    const { pdf, setVisiblePages } = props;
    const [ images, setImages ] = useState<string[]>([]);

    const handleImagesFromApi = () => {
        const imagesArr = [];
        for (let i = 1; i < pdf.metadata.totalPages + 1; i++) {
            imagesArr.push(`${process.env.ENDPOINT_API}/pdf/v2${pdf.path}/page/${i}`);
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
                    setVisiblePages={setVisiblePages}
                    pageId={i+1}
                    image={image}
                />
            ))}
        </Box>
    );
}

export default PdfImages;
