import React, { useEffect, useState } from 'react';
import PdfImages from '@/components/pdf/pdfImages/PdfImages';
import { getPdfMetadata, PDFMetadataDTO } from '@/utils/pdfUtils';
import ReactDOM from 'react-dom';
import { RawIntlProvider,FormattedMessage } from 'react-intl';
import { getDefaultLanguageCode, getLanguage } from './utils/locale';
import PdfPagesIndicator from './components/pdf/pdfPagesIndicator/PdfPagesIndicator';
import Loading from './components/loading';
import { THEME_COLOR_BACKGROUND_PAPER } from './config';
import { FilePdf as FilePdfIcon } from "@styled-icons/bootstrap/FilePdf";
import { NoItemList } from "@/utils/noItemList";

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
    const [ visiblePages, setVisiblePages ] = useState([1]);
    const [ searchPage, setSearchPage ] = useState(1);
    const [ pdf, setPdf ] = useState<PDF>({
        path: pdfPath,
        metadata: {
            totalPages: 0
        }
    });

    const locale = getLanguage(getDefaultLanguageCode());
    const currentPage = visiblePages.length ? Math.min(...visiblePages) : 1;

    useEffect(() => {
        setLoading(true);
            getPdfMetadata(url.searchParams.get(`pdf`) || ``, pdfEndpoint)
            .then((metadata: PDFMetadataDTO) => {
                if (metadata.status != undefined && metadata.status === `500`) {
                        setLoading(false);
                        setPdfError(true);
                } else {
                    if (Object.keys(metadata).length === 0) {
                        setPdfError(true);
                    } else {
                        setPdf({
                            path: pdfPath,
                            metadata
                        });
                        setPdfError(false);
                    }
                }
            })
            .catch(err => { setPdfError(true); })
            .finally(() => { setLoading(false); });
      }, []);


    if(loading){
        return (<Loading loaderColor={THEME_COLOR_BACKGROUND_PAPER} />)
    }

    return (
        <RawIntlProvider value={locale}>
                {pdfError ? (
                    <NoItemList icon={<FilePdfIcon/>} text={<FormattedMessage id="content.pdf.notAvailable" />}/> ): (
                    <>
                        <PdfPagesIndicator current={currentPage} total={pdf.metadata.totalPages} searchPage={searchPage} setSearchPage={setSearchPage} />
                        <PdfImages pdf={pdf} setVisiblePages={setVisiblePages}/>
                    </>
                    )}
        </RawIntlProvider>
    );
}


ReactDOM.render(<PdfViewer />, document.getElementById(`app-pdf`));
