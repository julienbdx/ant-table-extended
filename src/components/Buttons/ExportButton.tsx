import React, { useCallback, useRef, useState } from "react";
import { Button, Modal, Space, Table, Transfer } from "antd";
import {
  ExportOutlined,
  FileExcelOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";

export type IButtonColumnsProps = {
  labelExport?: string;
  columns: any;
  data: any[];
  selectedColumnsKeys: string[];
  transferTitles?: string[];
  filename?: string;
};

export const ColumnsButton: React.FC<IButtonColumnsProps> = ({
  labelExport = "Exporter",
  columns,
  data,
  selectedColumnsKeys,
  transferTitles = ["Colonnes disponibles", "Colonnes exportées"],
  filename = "RIPI-Export.csv",
}) => {
  const tableRef = useRef<any>();
  const [modalExportVisible, setModalExportVisible] = useState(false);
  const [transferTargetKeys, setTransferTargetKeys] = useState(
    selectedColumnsKeys
  );
  const columnsToDatasource = useCallback(() => {
    return columns
      .filter((column) => column.title && column.title !== "")
      .map((column) => {
        return {
          key: column.key || column.id || column.dataIndex,
          title: column.title || column.label,
        };
      });
  }, [columns]);

  const onItemTransferred = (targetKeys: string[]) => {
    setTransferTargetKeys(targetKeys);
  };

  const prepareDataToCsv = useCallback(
    (full: boolean) => {
      const res: Record<string, string>[] = [];
      data.forEach((row) => {
        let elem = {};
        (full ? columns.map((item) => item.key) : transferTargetKeys).forEach(
          (col) => {
            const columnDef = columns.find(
              (c) => c.key === col || c.id === col || c.dataIndex === col
            );

            if (columnDef)
              elem[
                columnDef.title || columnDef.label || columnDef.name || col
              ] = columnDef.renderExport
                ? (columnDef.renderExport(row as string, row) as string)
                : (row[col] as string);
          }
        );
        res.push(elem);
      });

      return res;
    },
    [columns, data, transferTargetKeys]
  );

  const prepareDataToPrint = useCallback(() => {
    const res = [];
    data.forEach((row) => {
      let elem = {};
      transferTargetKeys.forEach((col) => {
        elem[col] = row[col];
      });
      res.push(elem);
    });

    return res;
  }, [data, transferTargetKeys]);

  const prepareColumnsToPrint = useCallback(() => {
    return columns.filter(
      (c) =>
        undefined !==
        transferTargetKeys?.find(
          // @ts-ignore
          (tk) => tk === c.key || tk === c.id || tk === c.dataIndex
        )
    );
  }, [columns, transferTargetKeys]);

  const print = useReactToPrint({
    content: () => tableRef.current,
  });

  return (
    <>
      <Modal
        title="Exportation"
        width={800}
        visible={modalExportVisible}
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={() => setModalExportVisible(false)}
        onCancel={() => setModalExportVisible(false)}
        footer={[
          <Space key="footer-space">
            <Button key="imprimer" onClick={print}>
              <PrinterOutlined key="print-icon" className={"icon-mr"} />
              <span key="print-lib">Imprimer</span>
            </Button>
            <CSVLink
              key="csv"
              className={"ant-btn"}
              separator={";"}
              data={prepareDataToCsv(false)}
              filename={filename}
            >
              <FileExcelOutlined className={"icon-mr"} key="csv-icon" />
              <span key="csv-lib">Télécharger au format CSV</span>
            </CSVLink>
            <CSVLink
              key="csv"
              className={"ant-btn"}
              separator={";"}
              data={prepareDataToCsv(true)}
              filename={filename}
            >
              <FileExcelOutlined className={"icon-mr"} key="csv-icon" />
              <span key="csv-lib">Télécharger au format CSV (complet)</span>
            </CSVLink>
            <Button key="fermer" onClick={() => setModalExportVisible(false)}>
              Fermer
            </Button>
          </Space>,
        ]}
      >
        <Transfer
          listStyle={{
            width: 350,
            height: 300,
          }}
          dataSource={columnsToDatasource()}
          titles={transferTitles}
          targetKeys={transferTargetKeys}
          render={(item) => item.title}
          onChange={onItemTransferred}
        />
        <div ref={tableRef}>
          {data && (
            <Table
              key="tab-print"
              className={"print-only"}
              defaultExpandAllRows={true}
              columns={prepareColumnsToPrint()}
              dataSource={prepareDataToPrint()}
              pagination={false}
            />
          )}
        </div>
      </Modal>
      <Button
        icon={<ExportOutlined />}
        onClick={() => setModalExportVisible(true)}
      >
        {labelExport}
      </Button>
    </>
  );
};

export default ColumnsButton;
