import { Button } from "antd"
import { ROUTES } from "../../constants/routes"
import { Link } from "react-router-dom"
import './index.css'

const Home = () => {
    return (
        <div className="home_container">
            <h2></h2>
            <Link to={ROUTES.REGISTER}><Button type="primary">Get Started</Button></Link>
        </div>
    )
}

export default Home