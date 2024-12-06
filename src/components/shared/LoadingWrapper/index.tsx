import { Spin } from "antd";
import { ReactNode, FC } from "react";
import './index.css'

interface LoadingWrapperProps {
    loading: boolean;
    children: ReactNode;
  }

const LoadingWrapper: FC<LoadingWrapperProps> = ({ loading, children }) => {
    return (
        <div>
            {
                loading ? <div className="main_loading_container"><Spin size="large"/></div> : children
            }
        </div>
    )
}

export default LoadingWrapper