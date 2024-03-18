import React, { useEffect, useState } from "react";
import api from "../../connectionAPI";
import Table from "../../components/shared/Table";
import DefaultHeader from "../../components/layout/DefaultHeader";


const PageHome: React.FC = () => {

    const [inProductionData, setInProductionData] = useState([]);
    const [awaitingShipmentData, setAwaitingShipment] = useState([]);
    const [awaitingReleaseData, setAwaitingRelease] = useState([]);
    const [dispatchedData, setDispatched] = useState([]);
    const [typeMessageInProduction, setTypeMessageInProduction] = useState(false);
    const [typeMessageAwaitingRelease, setTypeMessageAwaitingRelease] = useState(false);
    const [typeMessageAwaitingShipment, setTypeMessageAwaitingShipment] = useState(false);
    const [typeMessageDispatched, setTypeMessageDispatched] = useState(false);


 

    const columnsAwaitingRelease: Array<Object> = [
        {
            name: 'Codigo do produto',
            selector: (row: any) => row.cod_produto,
            sortable: true
        },
        {
            name: 'Nome do arquivo',
            selector: (row: any) => row.nome_arquivo_proc

        },
        {
            name: 'Desc do Produto',
            selector: (row: any) => row.desc_produto

        },
        {
            name: 'Data de entrada',
            selector: (row: any) => row.dt_processamento
        },
        {
            name: 'Qtd cartões',
            selector: (row: any) => row.total_cartoes
        }
    ];

    const columnsInProduction: Array<Object> = [
        {
            name: 'Codigo do produto',
            selector: (row: any) => row.cod_produto,
            sortable: true
        },
        {
            name: 'Nome do arquivo',
            selector: (row: any) => row.nome_arquivo_proc,

        },
        {
            name: 'Desc do Produto',
            selector: (row: any) => row.desc_produto,


        },
        {
            name: 'Data Pros',
            selector: (row: any) => row.dt_processamento

        },
        {
            name: 'Quantidade de cartões',
            selector: (row: any) => row.total_cartoes,
            sortable: true
        },
        {
            name: 'Etapa',
            selector: (row: any) => row.status,
            sortable: true
        },
    ];

    const columnsAwaitingShipment: Array<Object> = [
        {
            name: 'Codigo do produto',
            selector: (row: any) => row.cod_produto,
            sortable: true
        },
        {
            name: 'Nome do arquivo',
            selector: (row: any) => row.nome_arquivo_proc

        },
        {
            name: 'Desc do Produto',
            selector: (row: any) => row.desc_produto

        },
        {
            name: 'Data de entrada',
            selector: (row: any) => row.dt_processamento
        },
        {
            name: 'Qtd cartões',
            selector: (row: any) => row.total_cartoes
        },
        {
            name : 'Empresa',
            selector: (row: any) => row.empresa
        },
      
       
    ];

    const columnsDispatched: Array<Object> = [
        {
            name: 'Codigo do produto',
            selector: (row: any) => row.cod_produto,
            sortable: true
        },
        {
            name: 'Nome do arquivo',
            selector: (row: any) => row.nome_arquivo_proc

        },
        {
            name: 'Desc do Produto',
            selector: (row: any) => row.desc_produto

        },
        {
            name: 'Data de entrada',
            selector: (row: any) => row.dt_processamento
        },
        {
            name: 'Data de saida',
            selector: (row: any) => row.dt_expedicao
        },
        {
            name: 'Qtd cartões',
            selector: (row: any) => row.total_cartoes
        },
        {
            name : 'Empresa',
            selector: (row: any) => row.empresa
        },
      
       
    ];
    useEffect(() => {

        const HomePageRequests = async () => {
            await api.get('/awaiting-release')
                .then((data) => {
                    console.log("Dados recebidos da rota /awaiting-release:", data.data);
                    setAwaitingRelease(data.data);
                }).catch(() => {
                    setTypeMessageAwaitingRelease(true);
                });
    
                await api.post('/production')
                .then((data) => {
                    console.log('teste')
                    setInProductionData(data.data)
                   
                }).catch(() => {
                    setTypeMessageInProduction(true)
                });
    
            await api.get('/awaiting-shipment')
                .then((data) => {
                    console.log("Dados recebidos da rota /awaiting-shipment:", data.data);
                    setAwaitingShipment(data.data);
                }).catch((error) => {
                    console.error("Erro ao obter dados da rota /awaiting-shipment:", error);
                    setTypeMessageAwaitingShipment(true);
                });
    
            await api.get('/dispatched')
                .then((data) => {
                    console.log("Dados recebidos da rota /dispatcheds:", data.data);
                    setDispatched(data.data);
                }).catch((error) => {
                    console.error("Erro ao obter dados da rota /dispatcheds:", error);
                    setTypeMessageDispatched(true);
                });
        }
    
        HomePageRequests();
    
    }, []);
    

    return (
        <div className="container-page-home">

            <DefaultHeader />

            <Table
                data={Array.isArray(awaitingReleaseData) ? awaitingReleaseData[0] : []}
                column={columnsAwaitingRelease}
                titleTable="Aguardando liberação"
                typeMessage={typeMessageAwaitingRelease}
            />

            <Table
                data={Array.isArray(inProductionData) ? inProductionData: []}
                column={columnsInProduction}
                titleTable="Em produção"
                typeMessage={typeMessageInProduction}
            />

            <Table
                data={Array.isArray(awaitingShipmentData) ? awaitingShipmentData[0] : []}
                column={columnsAwaitingShipment}
                titleTable="Aguardando Expedição"
                typeMessage={typeMessageAwaitingShipment}
            />


            <Table
                data={Array.isArray(dispatchedData) ? dispatchedData[0] : []}
                column={columnsDispatched}
                titleTable="Expedidos"
                typeMessage={typeMessageDispatched}
            />
        </div >
    )
}

export default PageHome;