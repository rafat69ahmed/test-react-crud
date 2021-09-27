import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const Loader = ({ size, spin, tip }) => {
    const antIcon = <LoadingOutlined spin />
    return (
        <div style={{ margin: '10px' }}>
            <center>
                <Spin size={size || 'medium'} indicator={!spin && antIcon} tip={tip || ''} />
            </center>
        </div>
    )
}

export default Loader
