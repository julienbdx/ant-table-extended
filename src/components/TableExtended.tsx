import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Input,
  Row,
  Space,
  Table,
  TablePaginationConfig,
} from "antd";
import { TableProps } from "antd/lib/table/Table";
import TableExtendedButtons from "./Buttons/TableExtendedButtons";
import "./TableExtended.css";
import { ColumnsType } from "antd/es/table";
import { FilterFilled, SearchOutlined } from "@ant-design/icons";
import Highlighter from "./Highlighter";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";

export type IColumnCustomizedProps<T> = {
  renderExport?: (record: ColumnsType<T>) => string;
};

export type ITableExtendedColumn<T> = ColumnsType<T> &
  IColumnCustomizedProps<T>;

export type ITableExtendedCustomizedProps<T> = {
  selectedColumnsKeys?: string[];
  searchableColumnsKeys?: string[];
  searchableByValueColumnsKeys?: string[];
  sortableColumnsKeys?: string[];
  extraColumns?: ColumnsType<T>;
  columns?: ITableExtendedColumn<T>;
  extras?: JSX.Element[];
  setSelectedColumnsKeys?: React.Dispatch<React.SetStateAction<string[]>>;
  defaultSetting?: {
    pagination?: TablePaginationConfig;
    filters?: Record<string, FilterValue | null>;
    sorter?: SorterResult<any> | SorterResult<any>[];
    extra?: TableCurrentDataSource<any>;
  };
  onTableChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
    extra: TableCurrentDataSource<any>
  ) => void;
};
export type ITableProps<T> = TableProps<T> & ITableExtendedCustomizedProps<T>;

type searchInfos = {
  searchText: "";
  searchedColumn: "";
};

export const TableExtended: React.FC<ITableProps<any>> = ({
  extras = undefined,
  extraColumns,
  dataSource,
  columns,
  selectedColumnsKeys = undefined,
  searchableColumnsKeys = undefined,
  searchableByValueColumnsKeys,
  sortableColumnsKeys,
  setSelectedColumnsKeys,
  onTableChange,
  defaultSetting,
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

  // SELECTED COLUMNS
  useEffect(() => {
    if (setSelectedColumnsKeys) {
      setSelectedColumnsKeys(tableSelectedColumnsKeys);
    }
  }, [setSelectedColumnsKeys, tableSelectedColumnsKeys]);

  // RECHERCHE

  const [searchValues, setSearchValues] = useState<searchInfos[]>([]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchValues((prev) => [
      ...prev.filter((c) => c.searchedColumn !== dataIndex),
      {
        searchText: selectedKeys[0],
        searchedColumn: dataIndex,
      },
    ]);
  };

  const handleReset = (clearFilters, dataIndex, confirm) => {
    clearFilters();
    setSearchValues((prev) => {
      return [...prev.filter((c) => c.searchedColumn !== dataIndex)];
    });
    confirm();
  };

  // /FIN RECHERCHE

  const getColumns = useCallback(() => {
    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const col = columns.find((c) => {
          // @ts-ignore
          return c.key === dataIndex || c.dataIndex === dataIndex;
        });
        return (
          <div style={{ padding: 8 }}>
            <Input
              placeholder={`Rechercher ${col.title ?? dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 120 }}
              >
                Rechercher
              </Button>
              <Button
                onClick={() => handleReset(clearFilters, dataIndex, confirm)}
                size="small"
                style={{ width: 90 }}
              >
                Annuler
              </Button>
            </Space>
          </div>
        );
      },
      render: (text, record, index) => {
        const renderFunc = columns.find((c) => {
          // @ts-ignore
          return c.key === dataIndex || c.dataIndex === dataIndex;
        })?.render;
        const searchColumnInfos = searchValues.find(
          (c) => c.searchedColumn === dataIndex
        );
        if (
          searchColumnInfos &&
          dataIndex === searchColumnInfos?.searchedColumn
        ) {
          return (
            <Highlighter
              key={dataIndex}
              textToHighlight={
                renderFunc ? renderFunc(text, record, index) : text
              }
              searchWords={[searchColumnInfos.searchText]}
              highlightClassName={"searchHighlight"}
            />
          );
        }
        return renderFunc ? renderFunc(text, record, index) : text;
      },
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) => {
        const filterFunc = columns.find((c) => {
          // @ts-ignore
          return c.key === dataIndex || c.dataIndex === dataIndex;
        })?.onFilter;

        if (filterFunc) return filterFunc(value, record);

        return record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "";
      },
    });

    const getColumnSearchByValueProps = (dataIndex) => {
      return {
        filterIcon: (filtered) => (
          <FilterFilled style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        filters: dataSource
          .map((r) => r[dataIndex])
          .filter((value, index, self) => self.indexOf(value) === index)
          .map((r) => {
            return { text: r, value: r };
          })
          .sort((a, b) =>
            a.value.toUpperCase().localeCompare(b.value.toUpperCase())
          ),
        onFilter: (value, record) => record[dataIndex].indexOf(value) === 0,
      };
    };

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

    // Que les colonnes visibles
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

    // Colonne searchable props
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

    // Colonne searchable props by value
    cols = cols.map((c) => {
      if (
        searchableByValueColumnsKeys &&
        searchableByValueColumnsKeys.find(
          // @ts-ignore
          (sc) => sc === c.key || sc === c.dataIndex || sc === c.id
        )
      ) {
        // colonne searchable
        c = {
          ...c,
          // @ts-ignore
          ...getColumnSearchByValueProps(c.key || c.dataIndex || c.id),
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

      c.defaultFilteredValue =
        defaultSetting && defaultSetting?.filters
          ? // @ts-ignore
            defaultSetting.filters[c.dataIndex] ?? defaultSetting.filters[c.key]
          : undefined;

      c.defaultSortOrder =
        // @ts-ignore
        defaultSetting?.sorter?.columnKey === c.key ||
        // @ts-ignore
        defaultSetting?.sorter?.columnKey === c.dataIndex
          ? // @ts-ignore
            defaultSetting?.sorter?.order
          : undefined;

      return c;
    });

    return cols;
  }, [
    columns,
    extraColumns,
    searchValues,
    dataSource,
    tableSelectedColumnsKeys,
    searchableColumnsKeys,
    searchableByValueColumnsKeys,
    sortableColumnsKeys,
    defaultSetting,
  ]);

  return (
    <div ref={tableRef}>
      <Table
        pagination={
          defaultSetting && defaultSetting.pagination
            ? defaultSetting.pagination
            : undefined
        }
        onChange={(
          pagination: TablePaginationConfig,
          filters: Record<string, FilterValue | null>,
          sorter: SorterResult<any> | SorterResult<any>[],
          extra: TableCurrentDataSource<any>
        ) => {
          if (onTableChange) onTableChange(pagination, filters, sorter, extra);
        }}
        className="TableExtended"
        dataSource={dataSource}
        columns={getColumns()}
        {...otherProps}
        title={() => (
          <Row key={"title"} justify="end">
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
