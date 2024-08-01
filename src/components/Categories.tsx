import { useEffect, useState } from 'react'
import Modal from "@material-ui/core/Modal";

export type Category = {
    categoryId: number,
    userId: number,
    name: string,
    budget: number,
}

function Categories() {

    const [categories, setCategories] = useState<Category[]>([]);
    const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(false);

    //adding account states
    const [categoryId, setCategoryId] = useState(0);
    const [categoryName, setCategoryName] = useState('');
    const [budget, setBudget] = useState(0);
    
    useEffect(()=> {
        fetch('http://localhost:8080/api/1/categories')
            .then(async (res: Response) => {
                return await res.json();
            })
            .then(data=> {setCategories(data)})
    }, []);
    
    const addCategory = () => {
        const newCategory = {
            categoryId: categoryId,
            userId: 1,
            name: categoryName,
            budget: budget,
        };

        fetch('http://localhost:8080/api/newcategory', {
            method: 'POST',
            headers:  {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCategory),
        })
        .then(response => response.json())
        .then((data) => {
            setCategories(prevCategories => [...prevCategories, data]);
            setCategoryId(0);
            setCategoryName('');
            setBudget(0);
            setIsAddCategoryVisible(false);
        })

    }

    return (
        <div>
            <h2>Accounts</h2>
            <button onClick={()=>{setIsAddCategoryVisible(true);}}>Add Category</button>
            <Modal 
                onClose={()=>{setIsAddCategoryVisible(false)}}
                open={isAddCategoryVisible}>
                    <label>
                        Category ID:
                            <input type="numeric" onChange={e=>{setCategoryId(parseFloat(e.target.value))}} />
                    </label>
                    <label>
                        Category name:
                            <input type="text" onChange={e=>{setCategoryName(e.target.value)}} />
                    </label>
                    <label>
                        Budget:
                            <input type="numeric" onChange={e=>{setBudget(parseFloat(e.target.value))}} />
                    </label>
                    <button onClick={(addCategory)}></button>
            </Modal>
            {categories.map( category => (
                <div>
                    <h3>{category.name}</h3>
                    <h4>${category.budget}</h4>
                </div>
            ))}
        </div>
    );
}

export default Categories;