
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
import { NoItemList } from "@/utils/utils";
import { Box } from "@material-ui/core";

export interface PDF {
    path: string;
    metadata: PDFMetadataDTO;
}

function PdfViewer () {
    const url = new URL(window.location.href);
    const pdfPath = url.searchParams.get(`pdf`) || ``;
    const pdfEndpoint = url.searchParams.get(`pdfendpoint`) || ``;
    const [ pdfError, setPdfError ] = useState(false);
    const [retry,setRetry] = useState(1);
    const containerRef = document.getElementById("app-pdf");

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
          console.log(retry);
          if(retry <= 3)
          {
  
            getPdfMetadata(url.searchParams.get(`pdf`) || ``, pdfEndpoint)
            .then(metadata => {
                if(metadata.status != undefined && metadata.status === "301")
                {
                    if(retry >= 3)
                    {
                    setLoading(false);
                    setPdfError(true);
                    }
                    setRetry(prevRetry => prevRetry+1);
                }
                else
                {
    
                    if(Object.keys(metadata).length == 0)
                    {
                    setPdfError(true);
                    }
                    else
                    {
                        setPdf({
                            path: pdfPath,
                            metadata
                        });
                        setPdfError(false);
                    }
                }
                
            })
            .catch(err => {
                setPdfError(true);
            })
            .finally(() => { setLoading(false) });
            
        }
        else
        {
          setPdfError(true);
          setLoading(false);
        }
        
      }, [retry]);

    const ifNotError = () => {
        return (
        <Box
          position="fixed"
          zIndex="9"
          width="100%"
          textAlign="center"
          display="flex"
          justifyContent="center"
          gridGap={10}
        >
          <PdfPagesIndicator current={currentPage} total={pdf.metadata.totalPages} searchPage={searchPage} setSearchPage={setSearchPage} />
          
          </Box>
        )
      }

    if(loading){
        return (<Loading loaderColor={THEME_COLOR_BACKGROUND_PAPER} />)
    }

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
              style={{background:"#e8e8e8"}}
              height="100vh"
            >
              
                {pdfError == true ? 
                <NoItemList
                    icon={<FilePdfIcon/>}
                    text={<FormattedMessage
                      id="content.pdf.notAvailable"
                      />}
                />
                 : ifNotError}
                
                </Box>

                {!pdfError && <PdfImages pdf={pdf} setVisiblePages={setVisiblePages}/>}
           
        </RawIntlProvider>
    );
}


ReactDOM.render(<PdfViewer />, document.getElementById(`app-pdf`));
