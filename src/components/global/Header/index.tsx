import { useSelector, useDispatch } from 'react-redux'
import { signOut } from 'firebase/auth'
import { auth } from '../../../services/firebase'
import { RootState } from '../../../ts/interfaces/rootState'
import { setIsAuth } from '../../../state-managment/slices/userProfile'
import { AppDispatch } from '../../../state-managment/store'
import { useQueryParam } from '../../../hooks/useQueryParam'
import { Button, Select, Spin } from 'antd'
import { CurrencyCode } from '../../../ts/enums/CurrencyCode'
import { CurrencySymbols } from '../../../constants/currencySymbols'
import { useEffect, useState, useRef } from 'react'
import { fetchAllExpenses, fetchAllIncomes, fetchExchangeRates } from '../../../state-managment/slices/financialData'
import { convertCurrency } from '../../../helpers/convertCurrency'
import './index.css'

const { Option } = Select

const Header = () => {
    const { authUserInfo: { isAuth } } = useSelector((store: RootState) => store.userProfile)
    const { totalExpenses, totalIncomes, exchangeRates, isLoading } = useSelector((store: RootState) => store.financialData)
    const dispatch = useDispatch<AppDispatch>()
    const { getQueryParam, setQueryParam } = useQueryParam()
    const [budget, setBudget] = useState<number>(0)
    const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>(CurrencyCode.AMD)
    const [symbol, setSymbol] = useState<string>(CurrencySymbols[CurrencyCode.AMD])
    const [isCurrencyLoading, setIsCurrencyLoading] = useState<boolean>(false)

    const isInitialRender = useRef(true)

    const fetchData = async (currency: CurrencyCode) => {
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
    }

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false

            const initialCurrency = (getQueryParam('currency') as CurrencyCode) || CurrencyCode.AMD
            const initialSymbol = CurrencySymbols[initialCurrency]

            setCurrentCurrency(initialCurrency)
            setSymbol(initialSymbol)

            fetchData(initialCurrency)
        }
    }, [dispatch, getQueryParam])

    useEffect(() => {
        if (!isLoading && exchangeRates && Object.keys(exchangeRates).length > 0) {
            const baseBudget = totalIncomes - totalExpenses
            const convertedBudget = convertCurrency(baseBudget, CurrencyCode.AMD, currentCurrency, exchangeRates)
            setBudget(convertedBudget)
        }
    }, [totalExpenses, totalIncomes, currentCurrency, exchangeRates])

    const handleCurrencyChange = async (value: CurrencyCode) => {
        const currencySymbol = CurrencySymbols[value]
        setCurrentCurrency(value)
        setSymbol(currencySymbol)

        setQueryParam({ currency: value, symbol: currencySymbol })

        setIsCurrencyLoading(true)

        try {
            await dispatch(fetchExchangeRates(value))
            await dispatch(fetchAllExpenses(value))
            await dispatch(fetchAllIncomes(value))
        } catch (error) {
            console.error('Error while fetching currency data:', error)
        } finally {
            setIsCurrencyLoading(false)
        }
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
            {isAuth ? <>
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
                </h2>  </> : <></>
            }

        </div>
    )
}

export default Header