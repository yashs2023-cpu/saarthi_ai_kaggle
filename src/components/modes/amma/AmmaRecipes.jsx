import React, { useState } from 'react';
import { useToast } from '../../../hooks/useToast';
import { useLanguage } from '../../../contexts/LanguageContext';
import voiceService from '../../../services/voice';
import geminiService from '../../../services/gemini';

// ── Cuisine emoji icons ──────────────────────────────────────────────────────
const CUISINE_ICONS = {
  'north-indian': '🥘', 'south-indian': '🍛', gujarati: '🥗',
  bengali: '🐟', snacks: '🥙', default: '🍽️',
};
const CUISINE_COLORS = {
  'north-indian': '#FF9933', 'south-indian': '#10B981',
  gujarati: '#6C63FF', bengali: '#0EA5E9', snacks: '#F59E0B', default: '#D4547A',
};

const DEFAULT_RECIPES = [
  { id: 1, cuisine: 'north-indian', name: 'Aloo Gobi Masala', time: '25 min', difficulty: 'Easy', servings: 4, calories: 120, ingredients: ['2 Potatoes (cubed)', '1 Cauliflower', '2 Onions', '2 Tomatoes', 'Cumin, Turmeric, Garam Masala'], steps: ['Heat oil, add cumin seeds', 'Sauté onions until golden', 'Add tomatoes and spices, cook 3 min', 'Add vegetables and 1/4 cup water', 'Cover and simmer 15 min until tender'], tip: 'Add kasuri methi at the end for restaurant-style flavour!' },
  { id: 2, cuisine: 'south-indian', name: 'Curd Rice (Dahi Bhat)', time: '15 min', difficulty: 'Easy', servings: 2, calories: 150, ingredients: ['1 cup Cooked Rice', '1 cup Curd', 'Cucumber', 'Pomegranate', 'Mustard seeds, Curry leaves'], steps: ['Cool the cooked rice completely', 'Mix with curd until smooth', 'Temper mustard seeds in 1 tsp oil', 'Add curry leaves and green chilli', 'Mix all together and garnish'], tip: 'Best served cold. Add salt just before eating.' },
  { id: 3, cuisine: 'gujarati', name: 'Khaman Dhokla', time: '25 min', difficulty: 'Easy', servings: 4, calories: 160, ingredients: ['Besan', 'Eno', 'Mustard Seeds', 'Green chillies', 'Curry leaves'], steps: ['Prepare batter with besan and eno', 'Steam for 15 minutes', 'Prepare tempering with mustard seeds', 'Pour tempering over dhokla', 'Serve with chutney'], tip: 'Add sugar syrup for softness.' },
  { id: 4, cuisine: 'bengali', name: 'Machher Jhol', time: '30 min', difficulty: 'Easy', servings: 3, calories: 200, ingredients: ['500g Rohu fish', 'Potato', 'Mustard oil', 'Turmeric', 'Cumin seeds', 'Tomato'], steps: ['Marinate fish with turmeric and salt', 'Fry fish pieces in mustard oil', 'Sauté cumin and potatoes', 'Add tomatoes and spices', 'Add fish and water, simmer 10 min'], tip: 'Use mustard oil for authentic Bengali taste.' },
  { id: 5, cuisine: 'north-indian', name: 'Paneer Butter Masala', time: '30 min', difficulty: 'Easy', servings: 4, calories: 280, ingredients: ['Paneer 200g', 'Tomato 3', 'Cream', 'Butter', 'Kashmiri chilli', 'Garam masala'], steps: ['Blend tomatoes smooth', 'Cook in butter with spices 10 min', 'Add cream and simmer', 'Add paneer cubes', 'Cook 5 min, garnish with cream'], tip: 'Use Kashmiri chilli for bright red colour without too much heat.' },
  { id: 6, cuisine: 'south-indian', name: 'Masala Dosa', time: '30 min', difficulty: 'Medium', servings: 2, calories: 210, ingredients: ['Dosa Batter', 'Potato 3', 'Onion 1', 'Mustard seeds', 'Curry leaves'], steps: ['Prepare potato masala with spices', 'Spread dosa batter thin on tawa', 'Cook until crisp and golden', 'Add masala filling', 'Fold and serve with sambar & chutney'], tip: 'Batter should be fermented overnight for best taste.' },
  { id: 7, cuisine: 'snacks', name: 'Vegetable Samosa', time: '30 min', difficulty: 'Medium', servings: 4, calories: 250, ingredients: ['Potato', 'Peas', 'Flour', 'Cumin', 'Garam masala'], steps: ['Prepare spiced potato filling', 'Make firm dough', 'Shape into cones and fill', 'Deep fry until golden', 'Serve with mint chutney'], tip: 'Keep dough stiff for crispy samosas.' },
  { id: 8, cuisine: 'north-indian', name: 'Chole Masala', time: '35 min', difficulty: 'Medium', servings: 4, calories: 220, ingredients: ['Chickpeas 1 cup', 'Onion 2', 'Tomato 2', 'Ginger Garlic Paste', 'Chole Masala'], steps: ['Pressure cook chickpeas 4 whistles', 'Sauté onion until dark golden', 'Add tomatoes and cook until oil separates', 'Add chole masala and chickpeas', 'Simmer 15 min, garnish with coriander'], tip: 'Slightly charring the onions gives authentic dhaba taste.' },
  { id: 9, cuisine: 'gujarati', name: 'Thepla', time: '25 min', difficulty: 'Easy', servings: 4, calories: 190, ingredients: ['Wheat Flour', 'Methi Leaves', 'Curd', 'Turmeric', 'Spices'], steps: ['Mix flour with methi, curd and spices', 'Knead into soft dough', 'Roll thin and cook on tawa', 'Apply ghee on both sides', 'Serve with pickle or curd'], tip: 'Thepla stays fresh for 2-3 days — great for travel.' },
  { id: 10, cuisine: 'snacks', name: 'Pani Puri', time: '20 min', difficulty: 'Easy', servings: 4, calories: 120, ingredients: ['Ready-made Puris', 'Potato', 'Mint leaves', 'Tamarind', 'Chaat masala'], steps: ['Boil and mash potatoes with spices', 'Blend mint, tamarind and spices for pani', 'Add ice cold water to pani', 'Make hole in puri, fill with potato', 'Pour pani and serve immediately'], tip: 'Pani should be very cold for the best experience.' },
];

const CUISINES = [
  { key: 'all', label: '🍽️ All' }, { key: 'north-indian', label: '🥘 North Indian' },
  { key: 'south-indian', label: '🍛 South Indian' }, { key: 'gujarati', label: '🥗 Gujarati' },
  { key: 'bengali', label: '🐟 Bengali' }, { key: 'snacks', label: '🥙 Snacks' },
];

const DIETARY = ['🌿 Veg', '🍗 Non-Veg', '🌱 Vegan', '🕊️ Jain'];
const COOK_TIME = ['⚡ Quick (15 min)', '🕐 Normal (30 min)', '👨‍🍳 Elaborate (45+ min)'];
const MEAL_TYPE = ['🌅 Breakfast', '☀️ Lunch', '🌙 Dinner', '🫙 Snack', '🍮 Dessert'];
const HEALTH_GOAL = ['🍛 Regular', '💉 Diabetic-friendly', '🥗 Low-calorie', '💪 High-protein'];

const getFavourites = () => {
  try { return JSON.parse(localStorage.getItem('saarthi_fav_recipes') || '[]'); } catch { return []; }
};
const saveFavourites = (favs) => {
  localStorage.setItem('saarthi_fav_recipes', JSON.stringify(favs));
};

export default function AmmaRecipes() {
  const [cuisine, setCuisine] = useState('all');
  const [activeTab, setActiveTab] = useState('browse'); // browse | favourites
  const [expanded, setExpanded] = useState(null);
  const [recipes, setRecipes] = useState(DEFAULT_RECIPES);
  const [favourites, setFavourites] = useState(getFavourites);
  const { showToast } = useToast();
  const { language } = useLanguage();

  // Context wizard state
  const [ingredients, setIngredients] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [dietary, setDietary] = useState('🌿 Veg');
  const [cookTime, setCookTime] = useState('🕐 Normal (30 min)');
  const [mealType, setMealType] = useState('☀️ Lunch');
  const [healthGoal, setHealthGoal] = useState('🍛 Regular');

  const isFav = (id) => favourites.some(f => f.id === id);

  const toggleFav = (recipe) => {
    const updated = isFav(recipe.id)
      ? favourites.filter(f => f.id !== recipe.id)
      : [...favourites, recipe];
    setFavourites(updated);
    saveFavourites(updated);
    showToast(isFav(recipe.id) ? 'Removed from favourites' : '❤️ Saved to favourites!', 'success');
  };

  const handleIngredientSubmit = () => {
    if (!ingredients.trim()) { showToast('Please enter ingredients first!', 'warning'); return; }
    setShowWizard(true);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setShowWizard(false);
    showToast('🍳 Creating your personalized recipe…', 'info');
    try {
      const richIngredients = `${ingredients}. Dietary preference: ${dietary}. Time available: ${cookTime}. Meal type: ${mealType}. Health goal: ${healthGoal}`;
      const cuisineHint = dietary.includes('Veg') || dietary.includes('Vegan') || dietary.includes('Jain') ? 'vegetarian' : 'Indian';
      const result = await geminiService.generateRecipe(richIngredients, cuisineHint, language);
      if (result && result.name) {
        const newRecipe = {
          id: Date.now(), cuisine: 'north-indian',
          name: result.name, time: (result.cookingTime || '30') + ' min',
          difficulty: result.difficulty || 'Medium', servings: parseInt(result.servings) || 4,
          calories: result.nutrition?.calories || 0,
          ingredients: Array.isArray(result.ingredients) ? result.ingredients : [ingredients],
          steps: Array.isArray(result.steps) ? result.steps : ['Cook as per your preference'],
          tip: result.tips || 'Cook with love! 🍳', isAIGenerated: true,
        };
        setRecipes(prev => [newRecipe, ...prev]);
        setExpanded(newRecipe.id);
        showToast('✨ AI Recipe generated!', 'success');
      } else { throw new Error('no result'); }
    } catch {
      // Offline fallback
      const terms = ingredients.toLowerCase().split(/[,\s]+/).filter(Boolean);
      const match = DEFAULT_RECIPES.find(r => terms.some(t => r.ingredients.join(' ').toLowerCase().includes(t) || r.name.toLowerCase().includes(t)));
      if (match) {
        const copy = { ...match, id: Date.now(), isAIGenerated: false };
        setRecipes(prev => [copy, ...prev]);
        setExpanded(copy.id);
        showToast('Found a matching offline recipe! 🍳', 'success');
      } else { showToast('Could not generate. Try different ingredients.', 'error'); }
    } finally { setGenerating(false); setIngredients(''); }
  };

  const handleListen = (recipe) => {
    const text = `${recipe.name}. Ingredients: ${recipe.ingredients.join(', ')}. Steps: ${recipe.steps.join('. ')}`;
    showToast(`🔊 Listening to ${recipe.name}…`, 'info');
    voiceService.speak(text, language, 'amma');
  };

  const displayRecipes = activeTab === 'favourites'
    ? favourites
    : (cuisine === 'all' ? recipes : recipes.filter(r => r.cuisine === cuisine));

  return (
    <div style={styles.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h1 style={styles.title}>🍽️ Smart Recipe Generator</h1>
          <p style={styles.subtitle}>AI-powered recipes tailored to your ingredients, diet & health goals</p>
        </div>
        <div style={styles.tabRow}>
          {[['browse', '🍳 All Recipes'], ['favourites', `❤️ Favourites (${favourites.length})`]].map(([key, label]) => (
            <button key={key} style={{ ...styles.tabBtn, background: activeTab === key ? 'var(--saffron)' : '#fff', color: activeTab === key ? '#fff' : 'var(--gray-700)', borderColor: activeTab === key ? 'var(--saffron)' : 'var(--gray-200)' }} onClick={() => setActiveTab(key)}>{label}</button>
          ))}
        </div>
      </div>

      {/* AI Generator */}
      {activeTab === 'browse' && (
        <div style={styles.generatorBox}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 4 }}>✨ AI Recipe Generator</h3>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 12 }}>Enter ingredients → choose your preferences → get a personalized recipe</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input className="saarthi-input" style={{ flex: 1, minWidth: 200 }} placeholder="e.g. potato, tomato, onion…" value={ingredients} onChange={e => setIngredients(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleIngredientSubmit()} />
            <button className="btn btn-primary" style={{ borderRadius: 'var(--r-md)', flexShrink: 0 }} onClick={handleIngredientSubmit} disabled={generating}>
              {generating ? '⏳ Generating…' : '✨ Customize & Generate'}
            </button>
          </div>
        </div>
      )}

      {/* Context Wizard */}
      {showWizard && (
        <div style={styles.wizardCard} className="anim-up">
          <div style={styles.wizardHeader}>
            <span style={{ fontSize: 22 }}>🎯</span>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--navy-deep)', fontSize: 15 }}>Tell me your preferences</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>I'll create the perfect recipe just for you</div>
            </div>
            <button style={styles.wizardClose} onClick={() => setShowWizard(false)}>✕</button>
          </div>
          <div style={styles.wizardGrid}>
            <div style={styles.wizardSection}>
              <div style={styles.wizardLabel}>🌿 Dietary Preference</div>
              <div style={styles.optionRow}>{DIETARY.map(d => (<button key={d} style={{ ...styles.optionBtn, background: dietary === d ? 'var(--saffron)' : '#fff', color: dietary === d ? '#fff' : 'var(--gray-700)', borderColor: dietary === d ? 'var(--saffron)' : 'var(--gray-200)' }} onClick={() => setDietary(d)}>{d}</button>))}</div>
            </div>
            <div style={styles.wizardSection}>
              <div style={styles.wizardLabel}>⏱️ Cooking Time</div>
              <div style={styles.optionRow}>{COOK_TIME.map(c => (<button key={c} style={{ ...styles.optionBtn, background: cookTime === c ? '#6C63FF' : '#fff', color: cookTime === c ? '#fff' : 'var(--gray-700)', borderColor: cookTime === c ? '#6C63FF' : 'var(--gray-200)' }} onClick={() => setCookTime(c)}>{c}</button>))}</div>
            </div>
            <div style={styles.wizardSection}>
              <div style={styles.wizardLabel}>🍽️ Meal Type</div>
              <div style={styles.optionRow}>{MEAL_TYPE.map(m => (<button key={m} style={{ ...styles.optionBtn, background: mealType === m ? '#10B981' : '#fff', color: mealType === m ? '#fff' : 'var(--gray-700)', borderColor: mealType === m ? '#10B981' : 'var(--gray-200)' }} onClick={() => setMealType(m)}>{m}</button>))}</div>
            </div>
            <div style={styles.wizardSection}>
              <div style={styles.wizardLabel}>💪 Health Goal</div>
              <div style={styles.optionRow}>{HEALTH_GOAL.map(h => (<button key={h} style={{ ...styles.optionBtn, background: healthGoal === h ? '#0EA5E9' : '#fff', color: healthGoal === h ? '#fff' : 'var(--gray-700)', borderColor: healthGoal === h ? '#0EA5E9' : 'var(--gray-200)' }} onClick={() => setHealthGoal(h)}>{h}</button>))}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn btn-primary" style={{ flex: 1, borderRadius: 'var(--r-full)' }} onClick={handleGenerate}>🍳 Generate My Recipe</button>
            <button className="btn btn-ghost" style={{ borderRadius: 'var(--r-full)' }} onClick={() => setShowWizard(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Cuisine filters */}
      {activeTab === 'browse' && (
        <div style={styles.filters}>
          {CUISINES.map(c => (
            <button key={c.key} style={{ ...styles.filterBtn, background: cuisine === c.key ? 'var(--saffron)' : '#fff', color: cuisine === c.key ? '#fff' : 'var(--gray-700)', borderColor: cuisine === c.key ? 'var(--saffron)' : 'var(--gray-200)' }} onClick={() => setCuisine(c.key)}>{c.label}</button>
          ))}
        </div>
      )}

      {/* Recipe list */}
      <div style={styles.recipesList}>
        {displayRecipes.length === 0 && (
          <div style={styles.empty}>
            <div style={{ fontSize: 48 }}>❤️</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-600)', marginTop: 8 }}>No favourites yet</div>
            <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>Save recipes by tapping the ❤️ button</div>
          </div>
        )}
        {displayRecipes.map(recipe => {
          const icon = CUISINE_ICONS[recipe.cuisine] || CUISINE_ICONS.default;
          const color = CUISINE_COLORS[recipe.cuisine] || CUISINE_COLORS.default;
          return (
            <div key={recipe.id} className="saarthi-card" style={{ borderLeft: `4px solid ${color}` }}>
              <div style={styles.recipeHeader} onClick={() => setExpanded(expanded === recipe.id ? null : recipe.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ ...styles.recipeIconBadge, background: color + '18', color }}>{icon}</div>
                  <div>
                    <h3 style={styles.recipeName}>{recipe.name}</h3>
                    <div style={styles.recipeMeta}>
                      <span className="badge badge-saffron">⏱️ {recipe.time}</span>
                      <span className="badge badge-gold">👥 {recipe.servings} servings</span>
                      {recipe.calories > 0 && <span className="badge badge-success">🔥 {recipe.calories} cal</span>}
                      {recipe.isAIGenerated && <span className="badge badge-royal">✨ AI</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button style={{ ...styles.favBtn, color: isFav(recipe.id) ? '#EF4444' : 'var(--gray-300)' }} onClick={e => { e.stopPropagation(); toggleFav(recipe); }} title="Save to favourites" aria-label="Toggle favourite">❤️</button>
                  <span style={{ fontSize: 18, color: 'var(--gray-400)' }}>{expanded === recipe.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expanded === recipe.id && (
                <div style={styles.recipeDetails} className="anim-up">
                  <div style={styles.twoCol}>
                    <div>
                      <h4 style={styles.sectionLabel}>🛒 Ingredients</h4>
                      <ul style={styles.ingredientList}>{recipe.ingredients.map((ing, i) => (<li key={i} style={styles.ingredient}><span style={{ color }}>•</span> {ing}</li>))}</ul>
                    </div>
                    <div>
                      <h4 style={styles.sectionLabel}>👨‍🍳 Steps</h4>
                      <ol style={styles.stepsList}>{recipe.steps.map((step, i) => (<li key={i} style={styles.step}><span style={{ ...styles.stepNum, background: color }}>{i + 1}</span>{step}</li>))}</ol>
                    </div>
                  </div>
                  <div style={{ ...styles.tipBox, borderColor: color + '30' }}>💡 <strong>Tip:</strong> {recipe.tip}</div>
                  <div style={styles.recipeActions}>
                    <button className="btn btn-sm btn-primary" onClick={() => handleListen(recipe)}>🔊 Listen</button>
                    <button className="btn btn-sm" style={{ background: isFav(recipe.id) ? '#FEF2F2' : '#fff', color: isFav(recipe.id) ? '#EF4444' : 'var(--gray-600)', border: `1px solid ${isFav(recipe.id) ? '#FECACA' : 'var(--gray-200)'}`, borderRadius: 'var(--r-full)' }} onClick={() => toggleFav(recipe)}>{isFav(recipe.id) ? '❤️ Saved' : '🤍 Save Recipe'}</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  title: { fontSize: 22, fontWeight: 800, color: 'var(--navy-deep)', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'var(--gray-500)' },
  tabRow: { display: 'flex', gap: 8 },
  tabBtn: { padding: '8px 18px', borderRadius: 'var(--r-full)', border: '1.5px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'var(--t-fast)' },
  generatorBox: { background: 'var(--ivory)', border: '1.5px solid var(--saffron-glow)', borderRadius: 'var(--r-xl)', padding: '20px', boxShadow: 'var(--shadow-sm)' },
  wizardCard: { background: '#fff', border: '1.5px solid var(--saffron-glow)', borderRadius: 'var(--r-xl)', padding: 20, boxShadow: 'var(--shadow-md)' },
  wizardHeader: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  wizardClose: { marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--gray-400)', padding: 4 },
  wizardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 },
  wizardSection: {},
  wizardLabel: { fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 },
  optionRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  optionBtn: { padding: '6px 12px', borderRadius: 'var(--r-full)', border: '1.5px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'var(--t-fast)' },
  filters: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  filterBtn: { padding: '7px 14px', borderRadius: 'var(--r-full)', border: '1.5px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'var(--t-fast)' },
  recipesList: { display: 'flex', flexDirection: 'column', gap: 14 },
  empty: { textAlign: 'center', padding: '48px 24px', background: '#fff', borderRadius: 'var(--r-xl)', border: '1px dashed var(--gray-200)' },
  recipeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
  recipeIconBadge: { width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 },
  recipeName: { fontSize: 16, fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 6 },
  recipeMeta: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  favBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: '4px', transition: 'transform 0.15s', lineHeight: 1 },
  recipeDetails: { marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--gray-100)' },
  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 16 },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 },
  ingredientList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 },
  ingredient: { fontSize: 13.5, color: 'var(--gray-700)', display: 'flex', gap: 6 },
  stepsList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 },
  step: { display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, color: 'var(--gray-700)', lineHeight: 1.5 },
  stepNum: { width: 22, height: 22, borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2 },
  tipBox: { background: 'var(--ivory)', border: '1.5px solid', borderRadius: 'var(--r-md)', padding: '12px 16px', fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.6, marginBottom: 14 },
  recipeActions: { display: 'flex', gap: 10, flexWrap: 'wrap' },
};
