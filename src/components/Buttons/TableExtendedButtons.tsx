import React from "react";
import { Space } from "antd";
import ColumnsButton from "./ColumnsButton";
import ExportButton from "./ExportButton";

export type IColumnsButtonProps = {
  columns: any[];
  selectedColumnsKeys: string[];
  setSelectedColumnsKeys: React.Dispatch<React.SetStateAction<string[]>>;
  labelColonnes?: string;
  labelExporter?: string;
  transferTitles?: string[];
  data: any[];
};

export const TableExtendedButtons: React.FC<IColumnsButtonProps> = ({
  columns,
  selectedColumnsKeys = [],
  setSelectedColumnsKeys,
  labelColonnes = "Colonnes",
  labelExporter = "Exporter",
  transferTitles = ["Toutes les colonnes", "Colonnes sélectionnées"],
  data,
}) => {
  return (
    <>
      <Space>
        <ColumnsButton
          columns={columns}
          selectedColumnsKeys={selectedColumnsKeys}
          setSelectedColumnsKeys={setSelectedColumnsKeys}
          labelColonnes={labelColonnes}
          transferTitles={transferTitles}
          key="colonnes"
        />
        <ExportButton
          key="export"
          labelExport={labelExporter}
          data={data}
          columns={columns}
          selectedColumnsKeys={selectedColumnsKeys}
        />
      </Space>
    </>
  );
};

export default TableExtendedButtons;
