import React from 'react';

function CategoryFilter({ categories, filteredCategory, onSelectCategory }) {
    return (
        <div className="category-list">
            {categories.map((category) => (
                <button
                    key={category}
                    type="button"
                    className={`category-pill ${filteredCategory === category ? 'category-pill--active' : ''}`}
                    onClick={() => onSelectCategory(category)}
                >
                    {category === 'all' ? 'Todas' : category}
                </button>
            ))}
        </div>
    );
}

export default CategoryFilter;