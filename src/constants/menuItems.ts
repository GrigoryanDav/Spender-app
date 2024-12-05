import {
    CarOutlined,
    ShoppingCartOutlined,
    CreditCardOutlined,
    GiftOutlined,
    ShoppingOutlined
} from '@ant-design/icons'
import { MenuItem } from '../ts/interfaces/menuItems';

export const menuItems: MenuItem[] = [
    { icon: CarOutlined, label: 'Car', value: 'car' },
    { icon: ShoppingCartOutlined, label: 'Food', value: 'food' },
    { icon: ShoppingOutlined, label: 'Shopping', value: 'shopping' },
    { icon: CreditCardOutlined, label: 'Payments', value: 'payments' },
    { icon: GiftOutlined, label: 'Gift', value: 'gift' }
];
