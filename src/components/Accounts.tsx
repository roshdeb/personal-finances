import { useEffect, useState } from 'react'
import Modal from "@material-ui/core/Modal";

export type Account = {
    accountId: number,
    userId: number,
    name: string,
    balance: number,
    type: string,
}

function Accounts() {

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isAddAccountVisible, setIsAddAccountVisible] = useState(false);

    //adding account states
    const [accountId, setAccountId] = useState(0);
    const [accountName, setAccountName] = useState('');
    const [accountType, setAccountType] = useState('Checking');
    const [accountBalance, setAccountBalance] = useState(0);
    
    useEffect(()=> {
        fetch('http://localhost:8080/api/1/accounts')
            .then(async (res: Response) => {
                return await res.json();
            })
            .then(data=> {setAccounts(data)})
    }, []);
    
    const addAccount = () => {
        const newAccount = {
            accountId: accountId,
            userId: 1,
            name: accountName,
            type: accountType,
            balance: accountBalance,
        };

        fetch('http://localhost:8080/api/newaccount', {
            method: 'POST',
            headers:  {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAccount),
        })
        .then(response => response.json())
        .then((data) => {
            setAccounts(prevAccounts => [...prevAccounts, data]);
            setAccountId(0);
            setAccountName('');
            setAccountType('Checking');
            setAccountBalance(0);
            setIsAddAccountVisible(false);
        })

    }

    return (
        <div>
            <h2>Accounts</h2>
            <button onClick={()=>{setIsAddAccountVisible(true);}}>Add Account</button>
            <Modal 
                onClose={()=>{setIsAddAccountVisible(false)}}
                open={isAddAccountVisible}>
                    <label>
                        Account ID:
                            <input type="numeric" onChange={e=>{setAccountId(parseFloat(e.target.value))}} />
                    </label>
                    <label>
                        Account name:
                            <input type="text" onChange={e=>{setAccountName(e.target.value)}} />
                    </label>
                    <label>
                        Account type:
                        <select onChange={e=>{setAccountType(e.target.value)}}>
                            <option value="checking">Checking</option>
                            <option value="savings">Savings</option>
                        </select>
                    </label>
                    <label>
                        Balance:
                            <input type="numeric" onChange={e=>{setAccountBalance(parseFloat(e.target.value))}} />
                    </label>
                    <button onClick={(addAccount)}></button>
            </Modal>
            {accounts.map( account => (
                <div>
                    <h3>{account.name}</h3>
                    <h4>${account.balance}</h4>
                    <h4>{account.type}</h4>
                </div>
            ))}
        </div>
    );
}

export default Accounts;