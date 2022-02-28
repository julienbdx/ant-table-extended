import React from "react";
import { Space } from "antd";
import ColumnsButton from "./ColumnsButton";
import ExportButton from "./ExportButton";

export type IColumnsButtonProps = {
  columns: any[];
  columnsExport?: any[];
  selectedColumnsKeys: string[];
  setSelectedColumnsKeys: React.Dispatch<React.SetStateAction<string[]>>;
  labelColonnes?: string;
  labelExporter?: string;
  labelExporterComplet?: string;
  transferTitles?: string[];
  data: any[];
};

export const TableExtendedButtons: React.FC<IColumnsButtonProps> = ({
  columns,
  columnsExport,
  selectedColumnsKeys = [],
  setSelectedColumnsKeys,
  labelColonnes = "Colonnes",
  labelExporter = "Exporter",
  labelExporterComplet = "Exporter (complet)",
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
          columns={columnsExport ? columnsExport : columns}
          selectedColumnsKeys={selectedColumnsKeys}
        />
        <ExportButton
          key="export-all"
          labelExport={labelExporterComplet}
          data={data}
          columns={columnsExport ? columnsExport : columns}
          selectedColumnsKeys={(columnsExport ? columnsExport : columns).map(
            (c) => c.key
          )}
        />
      </Space>
    </>
  );
};

export default TableExtendedButtons;
