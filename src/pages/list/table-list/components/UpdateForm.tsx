import React from 'react';
import { Modal } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import type { TableListItem } from '../data';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<TableListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            bodyStyle={{
              padding: '32px 40px 48px',
            }}
            destroyOnClose
            title="Rule configuration"
            visible={props.updateModalVisible}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm
        initialValues={{
          name: props.values.name,
          desc: props.values.desc,
        }}
        title="Basic Information"
      >
        <ProFormText
          name="name"
          label="Rule name"
          width="md"
          rules={[
            {
              required: true,
              message: 'Please enter the rule name!',
            },
          ]}
        />
        <ProFormTextArea
          name="desc"
          width="md"
          label="Rule description"
          placeholder="Please enter at least five characters"
          rules={[
            {
              required: true,
              message: 'Please enter the rules description of at least five characters!',
              min: 5,
            },
          ]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          target: '0',
          template: '0',
        }}
        title="Configuration rule properties"
      >
        <ProFormSelect
          name="target"
          width="md"
          label="Monitoring object"
          valueEnum={{
            0: 'Table I',
            1: 'Table II',
          }}
        />
        <ProFormSelect
          name="template"
          width="md"
          label="Rule template"
          valueEnum={{
            0: 'Rule template',
            1: 'Rule template two',
          }}
        />
        <ProFormRadio.Group
          name="type"
          label="Rule type"
          options={[
            {
              value: '0',
              label: 'powerful',
            },
            {
              value: '1',
              label: 'weak',
            },
          ]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          type: '1',
          frequency: 'month',
        }}
        title="Set dispatch cycle"
      >
        <ProFormDateTimePicker
          name="time"
          width="md"
          label="Starting time"
          rules={[
            {
              required: true,
              message: 'Please select the start time!',
            },
          ]}
        />
        <ProFormSelect
          name="frequency"
          label="Monitoring object"
          width="md"
          valueEnum={{
            month: 'moon',
            week: 'week',
          }}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
