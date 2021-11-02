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
    dataIndex: "country",
    title: "Country",
  },
];
