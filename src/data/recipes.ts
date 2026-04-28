/**
 * Curated recipes and vegetable recommendations per vegetable.
 */

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  ingredients: string[];
  steps: string[];
}

export interface VeggieData {
  recipes: Recipe[];
  relatedVeggies: string[];
}

const VEGGIE_DATA: Record<string, VeggieData> = {
  tomato: {
    recipes: [
      {
        id: 'tomato-1',
        name: 'Butter Tomato Curry',
        emoji: '🍛',
        time: '25 min',
        difficulty: 'Easy',
        description: 'Rich, creamy tomato curry with a hint of butter and aromatic spices.',
        ingredients: ['4 tomatoes', '2 tbsp butter', '1 onion', 'ginger-garlic paste', 'cream', 'kasuri methi', 'garam masala'],
        steps: [
          'Blanch and puree tomatoes.',
          'Sauté onion in butter until golden, add ginger-garlic paste.',
          'Add tomato puree and cook 10 min.',
          'Stir in cream, kasuri methi, and garam masala.',
          'Simmer 5 min and serve hot.',
        ],
      },
      {
        id: 'tomato-2',
        name: 'Tomato Rasam',
        emoji: '🥣',
        time: '20 min',
        difficulty: 'Easy',
        description: 'South Indian tangy soup — perfect for rainy days or a light starter.',
        ingredients: ['3 tomatoes', 'tamarind', 'rasam powder', 'mustard seeds', 'curry leaves', 'coriander'],
        steps: [
          'Boil tomatoes with tamarind water.',
          'Mash and strain.',
          'Add rasam powder, salt, and simmer.',
          'Temper with mustard seeds and curry leaves.',
          'Garnish with coriander.',
        ],
      },
      {
        id: 'tomato-3',
        name: 'Shakshuka',
        emoji: '🍳',
        time: '30 min',
        difficulty: 'Medium',
        description: 'Eggs poached in a spiced tomato sauce — a one-pan wonder.',
        ingredients: ['5 tomatoes', '2 eggs', 'bell pepper', 'cumin', 'paprika', 'chilli flakes', 'feta cheese'],
        steps: [
          'Sauté onion and pepper, add spices.',
          'Add chopped tomatoes and simmer 15 min.',
          'Make wells and crack eggs in.',
          'Cover and cook until eggs set.',
          'Top with feta and serve with bread.',
        ],
      },
    ],
    relatedVeggies: ['onion', 'capsicum', 'carrot', 'spinach', 'garlic'],
  },

  potato: {
    recipes: [
      {
        id: 'potato-1',
        name: 'Aloo Jeera',
        emoji: '🥔',
        time: '20 min',
        difficulty: 'Easy',
        description: 'Simple cumin-spiced potatoes — a classic Indian comfort dish.',
        ingredients: ['3 potatoes', '1 tsp cumin seeds', 'green chilli', 'coriander', 'turmeric', 'amchur'],
        steps: [
          'Boil and cube potatoes.',
          'Temper cumin seeds in oil.',
          'Add potatoes, turmeric, and salt.',
          'Toss well and cook 5 min.',
          'Finish with amchur and coriander.',
        ],
      },
      {
        id: 'potato-2',
        name: 'Crispy Potato Wedges',
        emoji: '🍟',
        time: '35 min',
        difficulty: 'Easy',
        description: 'Oven-baked wedges with smoky paprika and herbs — better than takeout.',
        ingredients: ['4 potatoes', 'olive oil', 'smoked paprika', 'garlic powder', 'rosemary', 'parmesan'],
        steps: [
          'Cut potatoes into wedges.',
          'Toss with oil and spices.',
          'Bake at 220°C for 30 min, flipping halfway.',
          'Sprinkle parmesan in last 5 min.',
          'Serve with dip.',
        ],
      },
      {
        id: 'potato-3',
        name: 'Dum Aloo',
        emoji: '🍲',
        time: '45 min',
        difficulty: 'Medium',
        description: 'Baby potatoes slow-cooked in a rich Kashmiri-style gravy.',
        ingredients: ['500g baby potatoes', 'yogurt', 'fennel powder', 'ginger powder', 'kashmiri chilli', 'whole spices'],
        steps: [
          'Prick and fry baby potatoes until golden.',
          'Make gravy with yogurt and spices.',
          'Add potatoes to gravy.',
          'Cover and cook on low heat 20 min.',
          'Garnish with coriander.',
        ],
      },
    ],
    relatedVeggies: ['onion', 'tomato', 'peas', 'cauliflower', 'carrot'],
  },

  onion: {
    recipes: [
      {
        id: 'onion-1',
        name: 'French Onion Soup',
        emoji: '🧅',
        time: '50 min',
        difficulty: 'Medium',
        description: 'Deeply caramelised onions in a rich broth topped with melted cheese.',
        ingredients: ['4 large onions', 'butter', 'thyme', 'white wine', 'vegetable broth', 'gruyère cheese', 'baguette'],
        steps: [
          'Caramelise onions in butter for 30 min.',
          'Add wine and reduce.',
          'Add broth and thyme, simmer 15 min.',
          'Ladle into bowls, top with bread and cheese.',
          'Broil until cheese is bubbly.',
        ],
      },
      {
        id: 'onion-2',
        name: 'Crispy Onion Bhaji',
        emoji: '🧆',
        time: '25 min',
        difficulty: 'Easy',
        description: 'Golden, crunchy fritters — the ultimate Indian street snack.',
        ingredients: ['2 onions', 'besan', 'green chilli', 'ajwain', 'coriander', 'chaat masala'],
        steps: [
          'Slice onions thin, mix with salt.',
          'Add besan, spices, and minimal water.',
          'Drop spoonfuls into hot oil.',
          'Fry until golden and crisp.',
          'Serve with mint chutney.',
        ],
      },
    ],
    relatedVeggies: ['tomato', 'garlic', 'ginger', 'capsicum', 'potato'],
  },

  spinach: {
    recipes: [
      {
        id: 'spinach-1',
        name: 'Palak Paneer',
        emoji: '🥬',
        time: '30 min',
        difficulty: 'Medium',
        description: 'Creamy spinach curry with soft paneer cubes — a restaurant favourite.',
        ingredients: ['250g spinach', '200g paneer', 'onion', 'tomato', 'cream', 'garam masala', 'kasuri methi'],
        steps: [
          'Blanch spinach and blend smooth.',
          'Sauté onion-tomato masala.',
          'Add spinach puree and cook 10 min.',
          'Add paneer cubes and cream.',
          'Finish with kasuri methi.',
        ],
      },
      {
        id: 'spinach-2',
        name: 'Spinach & Corn Quesadilla',
        emoji: '🫓',
        time: '15 min',
        difficulty: 'Easy',
        description: 'Quick, cheesy quesadillas packed with spinach and sweet corn.',
        ingredients: ['spinach', 'corn', 'mozzarella', 'tortillas', 'chilli flakes', 'garlic'],
        steps: [
          'Sauté garlic and spinach until wilted.',
          'Mix with corn and cheese.',
          'Fill tortilla and fold.',
          'Toast on pan until golden.',
          'Slice and serve with salsa.',
        ],
      },
    ],
    relatedVeggies: ['tomato', 'onion', 'garlic', 'peas', 'coriander'],
  },

  carrot: {
    recipes: [
      {
        id: 'carrot-1',
        name: 'Gajar Ka Halwa',
        emoji: '🥕',
        time: '45 min',
        difficulty: 'Medium',
        description: 'Classic Indian carrot pudding slow-cooked in milk with cardamom.',
        ingredients: ['500g carrots', 'full-fat milk', 'sugar', 'ghee', 'cardamom', 'cashews', 'raisins'],
        steps: [
          'Grate carrots and cook in milk until dry.',
          'Add sugar and ghee, stir well.',
          'Cook until mixture leaves sides.',
          'Add cardamom and nuts.',
          'Serve warm or chilled.',
        ],
      },
      {
        id: 'carrot-2',
        name: 'Carrot Ginger Soup',
        emoji: '🍵',
        time: '30 min',
        difficulty: 'Easy',
        description: 'Velvety, warming soup with a ginger kick — great for immunity.',
        ingredients: ['4 carrots', 'ginger', 'onion', 'coconut milk', 'vegetable stock', 'cumin'],
        steps: [
          'Sauté onion and ginger.',
          'Add carrots and stock, simmer 20 min.',
          'Blend until smooth.',
          'Stir in coconut milk.',
          'Season and serve.',
        ],
      },
    ],
    relatedVeggies: ['potato', 'peas', 'beans', 'ginger', 'onion'],
  },

  cauliflower: {
    recipes: [
      {
        id: 'cauliflower-1',
        name: 'Gobi Manchurian',
        emoji: '🥦',
        time: '35 min',
        difficulty: 'Medium',
        description: 'Crispy cauliflower florets tossed in a tangy Indo-Chinese sauce.',
        ingredients: ['1 cauliflower', 'cornflour', 'soy sauce', 'chilli sauce', 'spring onion', 'ginger-garlic'],
        steps: [
          'Coat florets in batter and deep fry.',
          'Sauté ginger-garlic in oil.',
          'Add sauces and toss florets.',
          'Cook 3 min on high heat.',
          'Garnish with spring onion.',
        ],
      },
    ],
    relatedVeggies: ['potato', 'peas', 'brinjal', 'capsicum', 'onion'],
  },

  capsicum: {
    recipes: [
      {
        id: 'capsicum-1',
        name: 'Stuffed Capsicum',
        emoji: '🫑',
        time: '40 min',
        difficulty: 'Medium',
        description: 'Colourful peppers stuffed with spiced rice and cheese, baked to perfection.',
        ingredients: ['3 capsicums', 'cooked rice', 'onion', 'tomato', 'cheese', 'mixed spices'],
        steps: [
          'Hollow out capsicums.',
          'Make spiced rice filling.',
          'Stuff capsicums and top with cheese.',
          'Bake at 180°C for 25 min.',
          'Serve hot.',
        ],
      },
    ],
    relatedVeggies: ['tomato', 'onion', 'brinjal', 'peas', 'carrot'],
  },

  brinjal: {
    recipes: [
      {
        id: 'brinjal-1',
        name: 'Baingan Bharta',
        emoji: '🍆',
        time: '35 min',
        difficulty: 'Easy',
        description: 'Smoky roasted aubergine mash with onions and spices.',
        ingredients: ['1 large brinjal', 'onion', 'tomato', 'green chilli', 'coriander', 'mustard oil'],
        steps: [
          'Roast brinjal directly on flame until charred.',
          'Peel and mash the flesh.',
          'Sauté onion and tomato in mustard oil.',
          'Add mashed brinjal and spices.',
          'Cook 5 min and garnish.',
        ],
      },
    ],
    relatedVeggies: ['tomato', 'onion', 'capsicum', 'potato', 'garlic'],
  },

  cucumber: {
    recipes: [
      {
        id: 'cucumber-1',
        name: 'Cucumber Raita',
        emoji: '🥒',
        time: '10 min',
        difficulty: 'Easy',
        description: 'Cool, refreshing yogurt dip — the perfect side for spicy food.',
        ingredients: ['1 cucumber', 'yogurt', 'cumin powder', 'mint', 'black salt'],
        steps: [
          'Grate or dice cucumber.',
          'Mix with yogurt.',
          'Add cumin, black salt, and mint.',
          'Chill for 10 min.',
          'Serve cold.',
        ],
      },
    ],
    relatedVeggies: ['tomato', 'onion', 'carrot', 'spinach', 'coriander'],
  },

  peas: {
    recipes: [
      {
        id: 'peas-1',
        name: 'Matar Paneer',
        emoji: '🫛',
        time: '30 min',
        difficulty: 'Easy',
        description: 'Peas and paneer in a lightly spiced tomato-onion gravy.',
        ingredients: ['1 cup peas', '200g paneer', 'onion', 'tomato', 'garam masala', 'cream'],
        steps: [
          'Make onion-tomato base.',
          'Add peas and cook 10 min.',
          'Add paneer cubes.',
          'Stir in cream and garam masala.',
          'Simmer 5 min.',
        ],
      },
    ],
    relatedVeggies: ['potato', 'carrot', 'beans', 'spinach', 'cauliflower'],
  },

  beans: {
    recipes: [
      {
        id: 'beans-1',
        name: 'Beans Poriyal',
        emoji: '🫘',
        time: '20 min',
        difficulty: 'Easy',
        description: 'South Indian stir-fried beans with coconut — simple and nutritious.',
        ingredients: ['250g beans', 'mustard seeds', 'curry leaves', 'grated coconut', 'turmeric', 'dried red chilli'],
        steps: [
          'Chop beans and steam until tender.',
          'Temper mustard seeds and curry leaves.',
          'Add beans and turmeric.',
          'Toss with coconut.',
          'Serve as a side.',
        ],
      },
    ],
    relatedVeggies: ['carrot', 'peas', 'potato', 'cauliflower', 'cabbage'],
  },

  cabbage: {
    recipes: [
      {
        id: 'cabbage-1',
        name: 'Cabbage Thoran',
        emoji: '🥬',
        time: '20 min',
        difficulty: 'Easy',
        description: 'Kerala-style dry cabbage stir-fry with coconut and spices.',
        ingredients: ['half cabbage', 'coconut', 'green chilli', 'turmeric', 'mustard seeds', 'curry leaves'],
        steps: [
          'Shred cabbage finely.',
          'Temper mustard seeds and curry leaves.',
          'Add cabbage and turmeric.',
          'Cook covered 10 min.',
          'Mix in coconut and serve.',
        ],
      },
    ],
    relatedVeggies: ['carrot', 'beans', 'peas', 'onion', 'potato'],
  },

  ginger: {
    recipes: [
      {
        id: 'ginger-1',
        name: 'Ginger Lemon Tea',
        emoji: '🍵',
        time: '10 min',
        difficulty: 'Easy',
        description: 'Soothing, immunity-boosting tea with fresh ginger and lemon.',
        ingredients: ['1 inch ginger', 'lemon', 'honey', 'water', 'black pepper'],
        steps: [
          'Boil water with grated ginger.',
          'Simmer 5 min.',
          'Strain into cup.',
          'Add lemon juice and honey.',
          'Stir and sip warm.',
        ],
      },
    ],
    relatedVeggies: ['garlic', 'onion', 'tomato', 'coriander', 'spinach'],
  },

  garlic: {
    recipes: [
      {
        id: 'garlic-1',
        name: 'Garlic Butter Naan',
        emoji: '🫓',
        time: '30 min',
        difficulty: 'Medium',
        description: 'Soft, pillowy naan brushed with fragrant garlic butter.',
        ingredients: ['flour', 'yogurt', 'garlic', 'butter', 'coriander', 'yeast'],
        steps: [
          'Make dough with flour, yogurt, and yeast.',
          'Rest 1 hour.',
          'Roll and cook on tawa.',
          'Brush with garlic butter.',
          'Garnish with coriander.',
        ],
      },
    ],
    relatedVeggies: ['onion', 'ginger', 'tomato', 'spinach', 'potato'],
  },

  coriander: {
    recipes: [
      {
        id: 'coriander-1',
        name: 'Green Chutney',
        emoji: '🌿',
        time: '5 min',
        difficulty: 'Easy',
        description: 'Vibrant, tangy coriander chutney — goes with everything.',
        ingredients: ['1 bunch coriander', 'mint', 'green chilli', 'lemon', 'garlic', 'salt'],
        steps: [
          'Blend all ingredients together.',
          'Add water for consistency.',
          'Adjust salt and lemon.',
          'Chill before serving.',
          'Keeps 3 days in fridge.',
        ],
      },
    ],
    relatedVeggies: ['ginger', 'garlic', 'onion', 'tomato', 'spinach'],
  },
};

export function getVeggieData(query: string): VeggieData {
  const key = query.trim().toLowerCase();
  return VEGGIE_DATA[key] ?? {
    recipes: [],
    relatedVeggies: ['tomato', 'potato', 'onion', 'spinach', 'carrot'],
  };
}
