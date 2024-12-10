import { useSelector, useDispatch } from 'react-redux'
import { signOut } from 'firebase/auth'
import { auth } from '../../../services/firebase'
import { RootState } from '../../../ts/interfaces/rootState'
import { setIsAuth } from '../../../state-managment/slices/userProfile'
import { AppDispatch } from '../../../state-managment/store'
import { Button, Select, Spin } from 'antd'
import { CurrencyCode } from '../../../ts/enums/CurrencyCode'
import { CurrencySymbols } from '../../../constants/currencySymbols'
import { useEffect, useState, useCallback } from 'react'
import { fetchAllExpenses, fetchAllIncomes, fetchExchangeRates } from '../../../state-managment/slices/financialData'
import { convertCurrency } from '../../../helpers/convertCurrency'
import { useLocation } from 'react-router-dom'
import { setCurrency } from '../../../state-managment/slices/currency'
import './index.css'



const { Option } = Select

const Header = () => {
    const location = useLocation()
    const { totalExpenses, totalIncomes, exchangeRates, isLoading } = useSelector((store: RootState) => store.financialData)
    const { currentCurrency, symbol } = useSelector((store: RootState) => store.currency)
    const dispatch = useDispatch<AppDispatch>()
    const [budget, setBudget] = useState<number>(0)
    const [isCurrencyLoading, setIsCurrencyLoading] = useState<boolean>(false)

    const fetchData = useCallback(async (currency: CurrencyCode) => {
        setIsCurrencyLoading(true)

        try {
            await Promise.all([
                dispatch(fetchExchangeRates(currency)),
                dispatch(fetchAllExpenses(currency)),
                dispatch(fetchAllIncomes(currency))
            ])
        } catch (error) {
            console.error('Error while fetching data:', error)
        } finally {
            setIsCurrencyLoading(false)
        }
    }, [dispatch])

    useEffect(() => {
        const savedCurrency = sessionStorage.getItem('currentCurrency')
    
        if (savedCurrency) {
            const currency = savedCurrency as CurrencyCode
            dispatch(setCurrency({ currency, symbol: CurrencySymbols[currency] }))
            fetchData(currency)
        } else {
            fetchData(currentCurrency)
        }
    }, [dispatch, currentCurrency, fetchData])

    useEffect(() => {
        if (!isLoading && exchangeRates && Object.keys(exchangeRates).length > 0) {
            const baseBudget = totalIncomes - totalExpenses
            const convertedBudget = convertCurrency(baseBudget, CurrencyCode.AMD, currentCurrency, exchangeRates)
            setBudget(convertedBudget)
        }
    }, [totalExpenses, totalIncomes, currentCurrency, exchangeRates, isLoading])


    const handleCurrencyChange = async (value: CurrencyCode) => {
        const currencySymbol = CurrencySymbols[value]

        dispatch(setCurrency({ currency: value, symbol: currencySymbol }))

        sessionStorage.setItem('currentCurrency', value)

        await fetchData(value)
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
        <div className="header_container">
            <h1>Spender</h1>
            {location.pathname.startsWith('/cabinet') ? <div>
                <div>
                    <Select
                        placeholder="Select a currency"
                        value={currentCurrency}
                        onChange={handleCurrencyChange}
                    >
                        {
                            Object.values(CurrencyCode).map((code) => (
                                <Option key={code} value={code}>
                                    {code.toUpperCase()}
                                </Option>
                            ))
                        }
                    </Select>
                    <Button onClick={handleLogout} className='logout_button'>Logout</Button>
                </div>

                <h2 style={{ color: 'white' }}>
                    {isLoading || isCurrencyLoading || !exchangeRates || Object.keys(exchangeRates).length === 0
                        ? <Spin size="large" />
                        : (
                            <>
                                Budget: <span style={{ color: budget >= 0 ? '#66FF00' : 'red' }}>
                                    {budget.toFixed(2)} {symbol}
                                </span>
                            </>
                        )
                    }
                </h2>
            </div> : null}
        </div>
    )
}

export default Header
