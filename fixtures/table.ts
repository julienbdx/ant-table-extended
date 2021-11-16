import { ColumnsType } from "antd/es/table";

// @ts-ignore
export { default as dataSource } from "./people-small";

export const columns: ColumnsType = [
  {
    title: "First Name",
    dataIndex: "firstName",
  },
  {
    dataIndex: "lastName",
    title: "Last Name",
  },
  {
    key: "country",
    dataIndex: "country",
    title: "Country",
  },
  {
    key: "abv",
    dataIndex: "country",
    title: "Country abbreviation",
    render: (value) => {
      return value?.toUpperCase().slice(0, 2);
    },
    onFilter: (value: string, record: any) => {
      return record.country
        .toUpperCase()
        .slice(0, 2)
        .includes(value?.toUpperCase());
    },
  },
];
