import { ExpenseFormValues } from "./expenseFormValues";
import { ExpenseType } from "../types/expenseType";
import { MenuItem } from "./menuItems";
import { FormInstance } from "antd";


export interface ExpenseFormProps {
    onFinish: (values: ExpenseFormValues) => void;
    onSelectChange: (value: ExpenseType) => void;
    form: FormInstance<ExpenseFormValues>
    buttonLoading: boolean;
    menuItems: MenuItem[];
    symbol: string;
}