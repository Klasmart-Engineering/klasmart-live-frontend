
import React, { useEffect, useState } from 'react';
import PdfImages from '@/components/pdf/pdfImages/PdfImages';
import { getPdfMetadata, PDFMetadataDTO } from '@/utils/pdfUtils';
import ReactDOM from 'react-dom';
import { RawIntlProvider } from 'react-intl';
import { getDefaultLanguageCode, getLanguage } from './utils/locale';
import PdfPagesIndicator from './components/pdf/pdfPagesIndicator/PdfPagesIndicator';
import Loading from './components/loading';
import { THEME_COLOR_BACKGROUND_PAPER } from './config';

export interface PDF {
    path: string;
    metadata: PDFMetadataDTO;
}

function PdfViewer () {
    const url = new URL(window.location.href);
    const pdfPath = url.searchParams.get(`pdf`) || ``;
    const pdfEndpoint = `${process.env.ENDPOINT_API}/pdf` || ``;

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
        getPdfMetadata(url.searchParams.get(`pdf`) || ``, pdfEndpoint)
        .then(metadata => {
            setPdf({
                path: pdfPath,
                metadata
            });
        })
        .catch(err => console.log(err))
        .finally(() => { setLoading(false) });
    }, []);

    if(loading){
        return (<Loading loaderColor={THEME_COLOR_BACKGROUND_PAPER} />)
    }

    return (
        <RawIntlProvider value={locale}>
            <>
                <PdfPagesIndicator current={currentPage} total={pdf.metadata.totalPages} searchPage={searchPage} setSearchPage={setSearchPage} />
                <PdfImages pdf={pdf} setVisiblePages={setVisiblePages} />
            </>
        </RawIntlProvider>
    );
}


ReactDOM.render(<PdfViewer />, document.getElementById(`app-pdf`));
