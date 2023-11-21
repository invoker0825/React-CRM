import { Table } from 'antd';
import './table.scss';

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
};

const CustomTable = (props) => {

    const showTotal = (total, range) => {
        return `Showing ${range[0]}-${range[1]} of ${total}`
    }

    return (
        <Table
            rowSelection={{
                type: 'checkbox',
                ...rowSelection,
            }}
            columns={props.columns}
            dataSource={props.dataSource}
            className={props.className ? props.className + ' custom-table' : 'custom-table'}
            pagination={{pageSize: 10, showTotal: showTotal}}
        />
    );
}

export default CustomTable;
