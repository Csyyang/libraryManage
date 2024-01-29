import { Button, Modal, Steps, Upload } from 'antd'
import styles from './index.module.css'
import { useState } from 'react'

// 批量导入
const BatchImport = ({ isModalOpen, setIsModalOpen }) => {

    const [step, setStep] = useState(0)

    const handleOk = () => {
        setStep(prew => ++prew)
        // setIsModalOpen(false);
    };

    const handleCancel = () => {
        setStep(0)
        setIsModalOpen(false);
    };

    const [fileList, setFileList] = useState([]);
    const props = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    return (
        <Modal title={step === 0 ? '下载模板' : '上传Excel'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText={step === 0 ? '已下载，下一步' : '上传'}>
            <Steps
                current={step}
                items={[
                    {
                        title: '第一步',
                        description: '下载模板',
                    },
                    {
                        title: '第二步',
                        description: '上传Excel',
                    }
                ]}

            />

            <div className={styles.downLoad}>
                {step === 0 ? '点击此处下载模板' : <Upload props={props}>上传</Upload>}
            </div>

        </Modal>
    )
}



const Manage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    return (
        <div>
            <Button className={styles.marR} type="primary" onClick={showModal}>批量导入</Button>
            <Button type="primary">单条导入</Button>
            <BatchImport isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}></BatchImport>
        </div>
    )
}

export default Manage