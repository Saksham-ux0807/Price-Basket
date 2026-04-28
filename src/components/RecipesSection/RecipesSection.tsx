import React, { useState } from 'react';
import { getVeggieData, type Recipe } from '../../data/recipes';
import './RecipesSection.css';

interface RecipesSectionProps {
  query: string;
  onSelectVeggie: (veggie: string) => void;
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`recipe-card ${open ? 'recipe-card--open' : ''}`}>
      <button
        className="recipe-card__header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="recipe-card__emoji">{recipe.emoji}</span>
        <div className="recipe-card__meta">
          <span className="recipe-card__name">{recipe.name}</span>
          <span className="recipe-card__tags">
            <span className="recipe-card__tag">{recipe.time}</span>
            <span className={`recipe-card__tag recipe-card__tag--${recipe.difficulty.toLowerCase()}`}>
              {recipe.difficulty}
            </span>
          </span>
        </div>
        <span className="recipe-card__chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="recipe-card__body">
          <p className="recipe-card__description">{recipe.description}</p>

          <div className="recipe-card__section">
            <h4 className="recipe-card__section-title">Ingredients</h4>
            <ul className="recipe-card__list">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>

          <div className="recipe-card__section">
            <h4 className="recipe-card__section-title">Steps</h4>
            <ol className="recipe-card__list recipe-card__list--ordered">
              {recipe.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export function RecipesSection({ query, onSelectVeggie }: RecipesSectionProps) {
  const { recipes, relatedVeggies } = getVeggieData(query);
  const veggieName = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();

  return (
    <div className="recipes-section">
      {/* Recipes */}
      {recipes.length > 0 && (
        <section className="recipes-section__block" aria-label={`Recipes for ${veggieName}`}>
          <h2 className="recipes-section__heading">
            🍽️ Tasty {veggieName} Recipes
          </h2>
          <div className="recipes-section__cards">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      {relatedVeggies.length > 0 && (
        <section className="recipes-section__block" aria-label="Vegetable recommendations">
          <h2 className="recipes-section__heading">
            🥗 You might also compare
          </h2>
          <div className="recipes-section__recommendations">
            {relatedVeggies.map((veggie) => (
              <button
                key={veggie}
                className="recipes-section__rec-btn"
                onClick={() => onSelectVeggie(veggie)}
                aria-label={`Compare ${veggie} prices`}
              >
                {veggie.charAt(0).toUpperCase() + veggie.slice(1)}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default RecipesSection;
