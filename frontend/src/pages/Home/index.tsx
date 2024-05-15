import React, { useEffect, useRef, useState } from "react";
import api from "../../connectionAPI";
import Table from "../../components/shared/Table";
import DefaultHeader from "../../components/layout/DefaultHeader";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadFacilitators from "../../components/layout/DownloadFacilitators";

const PageHome: React.FC = () => {
    const [inProductionData, setInProductionData] = useState<any[]>([]);
    const [awaitingShipmentData, setAwaitingShipment] = useState<any[]>([]);
    const [awaitingReleaseData, setAwaitingRelease] = useState<any[]>([]);
    const [dispatchedData, setDispatched] = useState<any[]>([]);

    const [typeMessageInProduction, setTypeMessageInProduction] = useState(false);
    const [typeMessageAwaitingRelease, setTypeMessageAwaitingRelease] = useState(false);
    const [typeMessageAwaitingShipment, setTypeMessageAwaitingShipment] = useState(false);
    const [typeMessageDispatched, setTypeMessageDispatched] = useState(false);

    const columnsAwaitingRelease: Array<Object> = [
        { name: 'Codigo do produto', selector: (row: any) => row.cod_produto, sortable: true },
        { name: 'Nome do arquivo', selector: (row: any) => row.nome_arquivo_proc },
        { name: 'Desc do Produto', selector: (row: any) => row.desc_produto },
        { name: 'Data de entrada', selector: (row: any) => row.dt_processamento },
        { name: 'Qtd cartões', selector: (row: any) => row.total_cartoes }
    ];

    const columnsInProduction: Array<Object> = [
        { name: 'Codigo do produto', selector: (row: any) => row.cod_produto, sortable: true },
        { name: 'Nome do arquivo', selector: (row: any) => row.nome_arquivo_proc },
        { name: 'Desc do Produto', selector: (row: any) => row.desc_produto },
        { name: 'Data Pros', selector: (row: any) => row.dt_processamento },
        { name: 'Quantidade de cartões', selector: (row: any) => row.total_cartoes, sortable: true },
        { name: 'Etapa', selector: (row: any) => row.status, sortable: true }
    ];

    const columnsAwaitingShipment: Array<Object> = [
        { name: 'Codigo do produto', selector: (row: any) => row.cod_produto, sortable: true },
        { name: 'Nome do arquivo', selector: (row: any) => row.nome_arquivo_proc },
        { name: 'Desc do Produto', selector: (row: any) => row.desc_produto },
        { name: 'Data de entrada', selector: (row: any) => row.dt_processamento },
        { name: 'Qtd cartões', selector: (row: any) => row.total_cartoes },
        { name: 'Empresa', selector: (row: any) => row.empresa }
    ];

    const columnsDispatched: Array<Object> = [
        { name: 'Codigo do produto', selector: (row: any) => row.cod_produto, sortable: true },
        { name: 'Nome do arquivo', selector: (row: any) => row.nome_arquivo_proc },
        { name: 'Desc do Produto', selector: (row: any) => row.desc_produto },
        { name: 'Data de entrada', selector: (row: any) => row.dt_processamento },
        { name: 'Data de saida', selector: (row: any) => row.dt_expedicao },
        { name: 'Qtd cartões', selector: (row: any) => row.total_cartoes },
        { name: 'Empresa', selector: (row: any) => row.empresa }
    ];

    useEffect(() => {
        const HomePageRequests = async () => {

            const awaitingReleaseResponse = await api.get('/awaiting-release');
            setAwaitingRelease(Array.isArray(awaitingReleaseResponse.data) ? awaitingReleaseResponse.data : []);



            const inProductionResponse = await api.post('/production');
            setInProductionData(Array.isArray(inProductionResponse.data) ? inProductionResponse.data : []);


            const awaitingShipmentResponse = await api.get('/awaiting-shipment');
            setAwaitingShipment(Array.isArray(awaitingShipmentResponse.data) ? awaitingShipmentResponse.data : []);



            const dispatchedResponse = await api.get('/dispatched');
            setDispatched(Array.isArray(dispatchedResponse.data) ? dispatchedResponse.data : []);

        }

        HomePageRequests();
    }, []);

    const refExcel1: any = useRef();
    const { onDownload: onDownload1 } = useDownloadExcel({
        currentTableRef: refExcel1.current,
        filename: "Aguardando Liberação",
        sheet: "Aguardando Liberação"
    });

    const refExcel2: any = useRef();
    const { onDownload: onDownload2 } = useDownloadExcel({
        currentTableRef: refExcel2.current,
        filename: "Em Produção",
        sheet: "Em Produção"
    });

    const refExcel3: any = useRef();
    const { onDownload: onDownload3 } = useDownloadExcel({
        currentTableRef: refExcel3.current,
        filename: "Aguardando Expedição",
        sheet: "Aguardando Expedição"
    });

    const refExcel4: any = useRef();
    const { onDownload: onDownload4 } = useDownloadExcel({
        currentTableRef: refExcel4.current,
        filename: "Expedidos",
        sheet: "Expedidos"
    });

    return (
        <div className="container-page-home">
            <DefaultHeader />
            <div>
                <Table
                    data={Array.isArray(awaitingReleaseData) ? awaitingReleaseData : []}
                    column={columnsAwaitingRelease}
                    titleTable="Aguardando liberação"
                    typeMessage={typeMessageAwaitingRelease}
                />
                <DownloadFacilitators excelClick={() => onDownload1()} printClick={() => window.print()} />
            </div>
            <div>
                <Table
                    data={Array.isArray(inProductionData) ? inProductionData : []}
                    column={columnsInProduction}
                    titleTable="Em produção"
                    typeMessage={typeMessageInProduction}
                />
                <DownloadFacilitators excelClick={() => onDownload2()} printClick={() => window.print()} />
            </div>
            <div>
                <Table
                    data={Array.isArray(awaitingShipmentData) ? awaitingShipmentData : []}
                    column={columnsAwaitingShipment}
                    titleTable="Aguardando Expedição"
                    typeMessage={typeMessageAwaitingShipment}
                />
                <DownloadFacilitators excelClick={() => onDownload3()} printClick={() => window.print()} />
            </div>
            <div>
                <Table
                    data={Array.isArray(dispatchedData) ? dispatchedData : []}
                    column={columnsDispatched}
                    titleTable="Expedidos"
                    typeMessage={typeMessageDispatched}
                />
                <DownloadFacilitators excelClick={() => onDownload4()} printClick={() => window.print()} />
            </div>
            <div className="table-container-dowload">
                <div className="scroll-table-dowload">
                    <table ref={refExcel1}>
                        <tbody>
                            <tr>
                                <td>Nome Arquivo</td>
                                <td>Cod Produto</td>
                                <td>Desc Produto</td>
                                <td>Data Entrada</td>
                                <td>Qtd Cartões</td>
                            </tr>
                            {awaitingReleaseData.map((data: any, index: number) =>
                                <tr key={index}>
                                    <td>{data.nome_arquivo_proc}</td>
                                    <td>{data.cod_produto}</td>
                                    <td>{data.desc_produto}</td>
                                    <td>{data.dt_processamento}</td>
                                    <td>{data.total_cartoes}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="scroll-table-dowload">
                    <table ref={refExcel2}>
                        <tbody>
                            <tr>
                                <td>Nome Arquivo</td>
                                <td>Cod Produto</td>
                                <td>Desc Produto</td>
                                <td>Data Entrada</td>
                                <td>Qtd Cartões</td>
                                <td>Etapa</td>
                            </tr>
                            {inProductionData.map((data: any, index: number) =>
                                <tr key={index}>
                                    <td>{data.nome_arquivo_proc}</td>
                                    <td>{data.cod_produto}</td>
                                    <td>{data.desc_produto}</td>
                                    <td>{data.dt_processamento}</td>
                                    <td>{data.total_cartoes}</td>
                                    <td>{data.status}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="scroll-table-dowload">
                    <table ref={refExcel3}>
                        <tbody>
                            <tr>
                                <td>Nome Arquivo</td>
                                <td>Cod Produto</td>
                                <td>Desc Produto</td>
                                <td>Data Entrada</td>
                                <td>Qtd Cartões</td>
                                <td>Empresa</td>
                            </tr>
                            {awaitingShipmentData.map((data: any, index: number) =>
                                <tr key={index}>
                                    <td>{data.nome_arquivo_proc}</td>
                                    <td>{data.cod_produto}</td>
                                    <td>{data.desc_produto}</td>
                                    <td>{data.dt_processamento}</td>
                                    <td>{data.total_cartoes}</td>
                                    <td>{data.empresa}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="scroll-table-dowload">
                    <table ref={refExcel4}>
                        <tbody>
                            <tr>
                                <td>Nome Arquivo</td>
                                <td>Cod Produto</td>
                                <td>Desc Produto</td>
                                <td>Data Entrada</td>
                                <td>Data Saida</td>
                                <td>Qtd Cartões</td>
                                <td>Empresa</td>

                            </tr>
                            {dispatchedData.map((data: any, index: number) =>
                                <tr key={index}>
                                    <td>{data.nome_arquivo_proc}</td>
                                    <td>{data.cod_produto}</td>
                                    <td>{data.desc_produto}</td>
                                    <td>{data.dt_processamento}</td>
                                    <td>{data.dt_expedicao}</td>
                                    <td>{data.total_cartoes}</td>
                                    <td>{data.empresa}</td>

                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PageHome;
