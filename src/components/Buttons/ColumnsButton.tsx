import React, { useCallback, useState } from "react";
import { Button, Modal, Transfer } from "antd";
import { ColumnWidthOutlined } from "@ant-design/icons";

export type IButtonColumnsProps = {
  columns: any[];
  selectedColumnsKeys: string[];
  setSelectedColumnsKeys: React.Dispatch<React.SetStateAction<string[]>>;
  labelColonnes?: string;
  transferTitles?: string[];
};

export const ColumnsButton: React.FC<IButtonColumnsProps> = ({
  columns,
  selectedColumnsKeys = [],
  setSelectedColumnsKeys,
  labelColonnes = "Colonnes",
  transferTitles = ["Toutes les colonnes", "Colonnes sélectionnées"],
}) => {
  const [modalColumnsVisible, setModalColumnsVisible] = useState(false);
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

  function handleColumnsButtonClick() {
    setModalColumnsVisible(true);
  }

  const onItemTransferred = (targetKeys: string[]) => {
    setTransferTargetKeys(targetKeys);
    setSelectedColumnsKeys(targetKeys);
  };

  return (
    <>
      <Modal
        title="Choix des colonnes affichées"
        width={800}
        visible={modalColumnsVisible}
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={() => setModalColumnsVisible(false)}
        onCancel={() => setModalColumnsVisible(false)}
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
      </Modal>
      <Button icon={<ColumnWidthOutlined />} onClick={handleColumnsButtonClick}>
        {labelColonnes}
      </Button>
    </>
  );
};

export default ColumnsButton;
