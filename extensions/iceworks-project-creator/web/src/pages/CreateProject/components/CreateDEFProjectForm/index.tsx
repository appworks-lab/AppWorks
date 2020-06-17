import React from 'react';
import { Form, Input, Button } from '@alifd/next';
import { IDEFProjectField } from '@/types';
import styles from './index.module.scss';

interface ICreateDEFProjectFormProps {
  value: IDEFProjectField;
  onChange: (value: IDEFProjectField) => void;
  children: React.ReactNode;
  skipCreateDEFProject: () => void;
  createProjectLoading: boolean;
  createProjectBtnDisabled: boolean;
  errorMsg?: string;
};

const CreateDEFProjectForm: React.FC<ICreateDEFProjectFormProps> = ({
  value,
  children,
  onChange,
  skipCreateDEFProject,
  createProjectLoading,
  createProjectBtnDisabled,
  errorMsg
}) => {
  return (
    <div className={styles.form}>
      <div className={styles.tip}>当前在内网环境，可创建 DEF 应用。<Button className={styles.btn} text disabled={createProjectBtnDisabled} loading={createProjectLoading} onClick={skipCreateDEFProject}>跳过创建</Button></div>
      <Form value={value} onChange={onChange} className={styles.form} responsive fullWidth labelAlign="top">
        <Form.Item
          colSpan={12}
          label="工号"
          required
          requiredMessage="请输入工号"
        >
          <Input placeholder="请输入工号" name="empId" />
        </Form.Item>
        <Form.Item
          colSpan={12}
          label="域账号"
          required
          requiredMessage="请输入域账号"
        >
          <Input placeholder="请输入域账号" name="account" />
        </Form.Item>
        <Form.Item
          colSpan={6}
          label="GitLab Group"
          required
          requiredMessage="请输入 GitLab Group"
        >
          <Input placeholder="请输入 GitLab Group" name="group" />
        </Form.Item>
        <Form.Item
          colSpan={6}
          label="仓库名"
          required
          requiredMessage="请输入仓库名"
        >
          <Input placeholder="请输入仓库名" name="project" />
        </Form.Item>
        <Form.Item
          colSpan={12}
          label="GitLab Token"
          help={<span className={styles.help}>打开 <a href="http://gitlab.alibaba-inc.com/profile/account" rel="noopener noreferrer" target="_blank">gitlab.alibaba-inc.com/profile/account</a> 复制页面的 <b>Private Token</b></span>}
          required
          requiredMessage="请输入GitLab Token"
        >
          <Input placeholder="请输入GitLab Token" name="gitlabToken" />
        </Form.Item>
        <Form.Item>
          {errorMsg && <div className={styles.errorMsg}>
            {errorMsg}
          </div>
          }
          <div className={styles.action}>
            {children}
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateDEFProjectForm;
