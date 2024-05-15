import React from "react";
import Icon from "../../shared/Icon";
import Button from "../../shared/Button";
import { CSVDownload, CSVLink } from "react-csv";

interface IDownloadFacilitators {
    printClick?: any;
    csvData?: any;
    excelClick?: any;
    refExcel?: any;
    wordClick?: any;
    textButton?: string;
    onClickButton?: any;
    children?: React.ReactNode; // Adicionando a propriedade children
}

const DownloadFacilitators: React.FC<IDownloadFacilitators> = ({ printClick, csvData, excelClick, wordClick, onClickButton, textButton, children }) => {
    return (
        <div className="container-download-facilitators-search">
            {textButton && <Button text={textButton} onClick={onClickButton} />}
            <div className="download-facilitators">
                {csvData ? (
                    <CSVLink data={csvData}>
                        <div className="container-icon"><img src="https://firebasestorage.googleapis.com/v0/b/project-vero-card-up.appspot.com/o/filecvs.svg?alt=media&token=f3dba8c9-f780-4881-a7e6-251cecd8e014" alt="" /></div>
                    </CSVLink>
                ) : null}
                <div className="container-icon" onClick={excelClick}><img src="https://firebasestorage.googleapis.com/v0/b/project-vero-card-up.appspot.com/o/fileexcel.svg?alt=media&token=2fd5a236-58cf-4bae-a541-e566087a064a" alt="" /></div>
            </div>
            {children}
        </div>
    );
};

export default DownloadFacilitators;
