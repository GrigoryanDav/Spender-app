import { useSelector } from 'react-redux'
import { signOut } from 'firebase/auth'
import { auth } from '../../../services/firebase'
import { RootState } from '../../../ts/interfaces/rootState'
import { ROUTES } from '../../../constants/routes'
import { Link, useNavigate } from 'react-router-dom'
import { setIsAuth } from '../../../state-managment/slices/userProfile'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../state-managment/store'
import { useQueryParam } from '../../../hooks/useQueryParam'
import { Button, Select } from 'antd'
import { CurrencyCode } from '../../../ts/enums/CurrencyCode'
import './index.css'
import { CurrencySymbols } from '../../../constants/currencySymbols'


const { Option } = Select

const Header = () => {
    const { authUserInfo: { isAuth } } = useSelector((store: RootState) => store.userProfile)
    const dispatch = useDispatch<AppDispatch>()
    const { getQueryParam, setQueryParam } = useQueryParam()
    const currentCurrency = getQueryParam('currency') || CurrencyCode.AMD

    const handleCurrencyChange = (value: string) => {
        const currencySymbol = CurrencySymbols[value as CurrencyCode]
        setQueryParam({ currency: value, symbol: currencySymbol })
    }

    const handleLogout = async () => {
        try {
            await signOut(auth)
            dispatch(setIsAuth(false))
        } catch (error) {
            console.log(error, 'signOut error')
        }
    }

    return (
        <div className='header_container'>
            <h1>Spender</h1>
            <div>
                <Select
                    placeholder='Select a currency'
                    value={currentCurrency}
                    onChange={handleCurrencyChange}
                >
                    {
                        Object.values(CurrencyCode).map((code) => {
                            return (
                                <Option key={code} value={code}>
                                    {code.toUpperCase()}
                                </Option>
                            )
                        })
                    }
                </Select>
                {
                    isAuth ?  <Button onClick={handleLogout}>Logout</Button> : <Link to={ROUTES.LOGIN}><Button>Sign In</Button></Link>
                }
            </div>
        </div>
    )
}

export default Header