import { Button } from "antd"
import { ROUTES } from "../../constants/routes"
import { Link } from "react-router-dom"
import BackgroundImage from '../../images/home-background.jpg'
import './index.css'

const Home = () => {
    return (
        <div className="home_container" style={{background: `url(${BackgroundImage})`}}>
            <h2>your finances in one place.</h2>
            <p>Flexibly budget and track your spending, so you stay in control and achieve your goals.</p>
            <Link to={ROUTES.REGISTER}><Button type="primary">Get Started</Button></Link>
        </div>
    )
}

export default Home