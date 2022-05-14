import React, { useEffect, useState } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  message,
} from 'antd';
import axios from 'axios';
import { BackendUrl } from '../url';
import { DeleteOutlined } from '@ant-design/icons';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === 'number' ? (
      <InputNumber />
    ) : (
      <Input disabled={dataIndex === 'email' ? true : false} />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
function UserList({ userData, reCallUserData }) {
  const [form] = Form.useForm();
  const [data, setData] = useState(userData);
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    setData(userData);
  }, [userData]);
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      _id:'',
      firstName: '',
      lastName: '',
      email: '',
      age: '',
      introduction: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const deleted = (record) => {
    axios
      .delete(`${BackendUrl}/users/${record._id}`)
      .then(() => {
        message.success('User Deleted!');
        reCallUserData();
      })
      .catch((error) => {
        message.error(error.response.data.msg || 'Internal server error!');
      });
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();

      await axios
        .put(`${BackendUrl}/users/${key}`, row)
        .then(() => message.success('user updated!'))
        .catch((error) => {
          message.error(error.response.data.msg || 'Internal server error!');
        });
      const newData = [...data];

      const index = newData.findIndex((item) => key === item._id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) { }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      width: '15%',
      editable: false,
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      width: '15%',
      editable: true,
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      width: '15%',
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '20%',
      editable: true,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      width: '10%',
      editable: true,
    },
    {
      title: 'Introduction',
      dataIndex: 'introduction',
      width: '40%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href='javascript:;'
              onClick={() => save(record._id)}
              style={{
                marginRight: 8,
              }}>
              Save
            </a>
            <Popconfirm title='Sure to cancel?' onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            {' '}
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => deleted(record)}>
              <DeleteOutlined style={{ color: 'red', marginLeft: '20px' }} />
            </Typography.Link>
          </>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName='editable-row'
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
}

export default UserList;
