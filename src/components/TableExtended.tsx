import React, { useCallback, useRef, useState } from "react";
import { Button, Col, Input, Row, Space, Table } from "antd";
import { TableProps } from "antd/lib/table/Table";
import TableExtendedButtons from "./Buttons/TableExtendedButtons";
import "./TableExtended.css";
import { ColumnsType } from "antd/es/table";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

export type ITableUtils = {
  selectedColumnsKeys?: string[];
  searchableColumnsKeys?: string[];
  sortableColumnsKeys?: string[];
  extraColumns?: ColumnsType;
  extras?: JSX.Element;
};
export type ITableProps<T> = TableProps<T> & ITableUtils;

export const TableExtended: React.FC<ITableProps<any>> = ({
  extras = undefined,
  extraColumns,
  dataSource,
  columns,
  selectedColumnsKeys = undefined,
  searchableColumnsKeys = undefined,
  sortableColumnsKeys,
  ...otherProps
}) => {
  const tableRef = useRef<any>();
  const [tableSelectedColumnsKeys, setTableSelectedColumnsKeys] = useState<
    string[]
  >(
    selectedColumnsKeys ??
      columns.map(
        // @ts-ignore
        (c) => (c.key as string) ?? c.dataIndex
      )
  );

  // RECHERCHE

  const [searchValues, setSearchValues] = useState({
    searchText: "",
    searchedColumn: "",
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchValues({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchValues((prev) => {
      return { ...prev, searchText: "" };
    });
  };

  // /RECHERCHE

  // TRI
  const getColumns = useCallback(() => {
    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Rechercher ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchValues({
                  searchText: selectedKeys[0],
                  searchedColumn: dataIndex,
                });
              }}
            >
              Filter
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "",
      render: (text) =>
        searchValues.searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchValues.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    });
    const getColumnSortProps = (dataIndex) => {
      return {
        sorter: (a, b) =>
          a[dataIndex]
            .toString()
            .toLowerCase()
            .localeCompare(b[dataIndex].toString().toLowerCase()),
        //   sortDirections: ["descend"],
      };
    };
    // /TRI

    let cols = [
      ...columns.filter(
        (c) =>
          undefined !==
          tableSelectedColumnsKeys?.find(
            // @ts-ignore
            (tk) => tk === c.key || tk === c.id || tk === c.dataIndex
          )
      ),
      ...(extraColumns ?? []),
    ];

    // Colonne searchabe
    cols = cols.map((c) => {
      if (
        searchableColumnsKeys &&
        searchableColumnsKeys.find(
          // @ts-ignore
          (sc) => sc === c.key || sc === c.dataIndex || sc === c.id
        )
      ) {
        // colonne searchable
        c = {
          ...c,
          // @ts-ignore
          ...getColumnSearchProps(c.key || c.dataIndex || c.id),
        };
      }
      return c;
    });

    // Colonne sortable
    cols = cols.map((c) => {
      if (
        sortableColumnsKeys &&
        sortableColumnsKeys.find(
          // @ts-ignore
          (sc) => sc === c.key || sc === c.dataIndex || sc === c.id
        )
      ) {
        // colonne sortable
        c = {
          ...c,
          // @ts-ignore
          ...getColumnSortProps(c.key || c.dataIndex || c.id),
        };
      }
      return c;
    });

    return cols;
  }, [
    extraColumns,
    searchValues.searchText,
    searchValues.searchedColumn,
    searchableColumnsKeys,
    sortableColumnsKeys,
    columns,
    tableSelectedColumnsKeys,
  ]);

  return (
    <div ref={tableRef}>
      <Table
        className="TableExtended"
        dataSource={dataSource}
        columns={getColumns()}
        {...otherProps}
        title={() => (
          <Row justify="end">
            <Col span={24}>
              <Space className="w-100 mlauto-2">
                <div>{extras} </div>
                <TableExtendedButtons
                  // @ts-ignore
                  data={dataSource}
                  columns={columns}
                  setSelectedColumnsKeys={setTableSelectedColumnsKeys}
                  selectedColumnsKeys={tableSelectedColumnsKeys}
                />
              </Space>
            </Col>
          </Row>
        )}
      />
    </div>
  );
};

export default TableExtended;
