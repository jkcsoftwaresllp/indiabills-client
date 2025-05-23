import { useState } from 'react';
import { useStore } from '../../../store/store.ts'; // Adjust the import path as necessary

const OptionsEditor = () => {
    const [newCategory, setNewCategory] = useState('');
    // const setOptions = useStore((state) => state.setOptions);

    const handleSubmit = (e) => {
        e.preventDefault();
        useStore.getState().setOptions({
            categoryOptions: [...useStore.getState().categoryOptions, newCategory]
        });
        setNewCategory('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add new category"
            />
            <button type="submit">Add Category</button>
        </form>
    );
};

export default OptionsEditor;