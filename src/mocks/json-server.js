import pkg from 'json-server';
import express from 'express';
const { create, router: _router, defaults } = pkg;

const server = create();
const router = _router('db.json');
const middlewares = defaults();

// Set up body parsing middleware
server.use(middlewares);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Error response builder
const createErrorResponse = (status, detail) => ({
  type: 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
  title: status === 404 ? 'Not Found' : 'Bad Request',
  status,
  detail
});

// Validation middleware
const validateNutritionInfo = (req, res, next) => {
  const requiredFields = ['name', 'servingSize', 'servingUnit', 'foodCategory', 'caloriesPerServing'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).jsonp(
      createErrorResponse(400, `Missing required fields: ${missingFields.join(', ')}`)
    );
  }
  
  // Validate numeric fields
  const numericFields = ['servingSize', 'servingUnit', 'foodCategory', 'caloriesPerServing'];
  const invalidFields = numericFields.filter(field => 
    req.body[field] && (isNaN(req.body[field]) || req.body[field] < 0)
  );
  
  if (invalidFields.length > 0) {
    return res.status(400).jsonp(
      createErrorResponse(400, `Invalid numeric values for fields: ${invalidFields.join(', ')}`)
    );
  }
  
  next();
};

// GET /api/v1/nutrition-info
server.get('/api/v1/nutrition-info', (req, res) => {
  try {
    const db = router.db;
    const { 
      pageNumber = 1, 
      pageSize = 10, 
      name, 
      foodCategory, 
      servingUnit, 
      minCalories, 
      maxCalories,
      sortBy = 'id',
      sortOrder = 'asc'
    } = req.query;
    
    let items = db.get('nutrition-info-details').value();
    
    // Apply filters
    if (name) {
      items = items.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (foodCategory) {
      items = items.filter(item => item.foodCategory === parseInt(foodCategory));
    }
    if (servingUnit) {
      items = items.filter(item => item.servingUnit === parseInt(servingUnit));
    }
    if (minCalories) {
      items = items.filter(item => item.caloriesPerServing >= parseInt(minCalories));
    }
    if (maxCalories) {
      items = items.filter(item => item.caloriesPerServing <= parseInt(maxCalories));
    }
    
    // Apply sorting
    items.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder.toLowerCase() === 'desc') {
        return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
      }
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    });
    
    // Apply pagination
    const start = (parseInt(pageNumber) - 1) * parseInt(pageSize);
    const paginatedItems = items.slice(start, start + parseInt(pageSize));
    
    const response = {
      items: paginatedItems,
      totalCount: items.length,
      pageNumber: parseInt(pageNumber),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(items.length / parseInt(pageSize)),
      hasPreviousPage: parseInt(pageNumber) > 1,
      hasNextPage: start + parseInt(pageSize) < items.length
    };
    
    res.jsonp(response);
  } catch (error) {
    console.error('Error in GET /api/v1/nutrition-info:', error);
    res.status(500).jsonp(createErrorResponse(500, 'Internal server error'));
  }
});

// GET /api/v1/nutrition-info/:id
server.get('/api/v1/nutrition-info/:id', (req, res) => {
  try {
    const db = router.db;
    const detail = db.get('nutrition-info-details')
      .find({ id: parseInt(req.params.id) })
      .value();
    
    if (!detail) {
      return res.status(404).jsonp(createErrorResponse(404, 'Nutrition info not found'));
    }
    
    res.jsonp(detail);
  } catch (error) {
    console.error('Error in GET /api/v1/nutrition-info/:id:', error);
    res.status(500).jsonp(createErrorResponse(500, 'Internal server error'));
  }
});

// POST /api/v1/nutrition-info
server.post('/api/v1/nutrition-info', validateNutritionInfo, (req, res) => {
  try {
    const db = router.db;
    const newItem = {
      ...req.body,
      id: Date.now(),
      tenantId: 1,
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString()
    };

    console.log("requestBody:", newItem);

    // Add to both collections to maintain consistency
    db.get('nutrition-info-details').push(newItem).write();
    db.get('nutrition-info-list').push({
      id: newItem.id,
      name: newItem.name,
      servingSize: newItem.servingSize,
      servingUnit: newItem.servingUnit,
      foodCategory: newItem.foodCategory,
      caloriesPerServing: newItem.caloriesPerServing,
      totalFat: newItem.totalFat,
      protein: newItem.protein,
      carbohydrates: newItem.carbohydrates,
      fiber: newItem.fiber,
      sugars: newItem.sugars,
      sodium: newItem.sodium,
      tenantId: newItem.tenantId
    }).write();

    res.status(201).jsonp({ id: newItem.id });
  } catch (error) {
    console.error('Error creating nutrition info:', error);
    res.status(500).jsonp(
      createErrorResponse(500, 'Failed to create nutrition info')
    );
  }
});

// PUT /api/v1/nutrition-info/:id
server.put('/api/v1/nutrition-info/:id', validateNutritionInfo, (req, res) => {
  try {
    const db = router.db;
    const id = parseInt(req.params.id);
    const nutritionInfo = db.get('nutrition-info-details')
      .find({ id })
      .value();
    
    if (!nutritionInfo) {
      return res.status(404).jsonp(createErrorResponse(404, 'Nutrition info not found'));
    }
    
    const updatedInfo = {
      ...nutritionInfo,
      ...req.body,
      id, // Ensure ID cannot be changed
      lastModifiedAt: new Date().toISOString()
    };
    
    db.get('nutrition-info-details')
      .find({ id })
      .assign(updatedInfo)
      .write();
    
    res.status(200).jsonp(updatedInfo);
  } catch (error) {
    console.error('Error in PUT /api/v1/nutrition-info/:id:', error);
    res.status(500).jsonp(createErrorResponse(500, 'Internal server error'));
  }
});

// DELETE /api/v1/nutrition-info/:id
server.delete('/api/v1/nutrition-info/:id', (req, res) => {
  try {
    const db = router.db;
    const id = parseInt(req.params.id);
    const exists = db.get('nutrition-info-details')
      .find({ id })
      .value();
    
    if (!exists) {
      return res.status(404).jsonp(createErrorResponse(404, 'Nutrition info not found'));
    }
    
    db.get('nutrition-info-details')
      .remove({ id })
      .write();
    
    res.status(204).send();
  } catch (error) {
    console.error('Error in DELETE /api/v1/nutrition-info/:id:', error);
    res.status(500).jsonp(createErrorResponse(500, 'Internal server error'));
  }
});

// GET /api/v1/diets
server.get('/api/v1/diets', (req, res) => {
  try {
    const db = router.db;
    const { minCalories, maxCalories, dietType, page = 1, pageSize = 10 } = req.query;
    let diets = db.get('diets').value();

    if (minCalories) diets = diets.filter(d => d.totalCalories >= Number(minCalories));
    if (maxCalories) diets = diets.filter(d => d.totalCalories <= Number(maxCalories));
    if (dietType) diets = diets.filter(d => d.dietType === dietType);

    const start = (page - 1) * pageSize;
    const paginatedDiets = diets.slice(start, start + Number(pageSize));

    res.jsonp(paginatedDiets);
  } catch (error) {
    console.error('Error in GET /api/v1/diets:', error);
    res.status(500).jsonp(createErrorResponse(500, 'Internal server error'));
  }
});

// GET /api/v1/diets/:id
server.get('/api/v1/diets/:id', (req, res) => {
  try {
    const db = router.db;
    const diet = db.get('diets')
      .find({ id: Number(req.params.id) })
      .value();
    
    if (!diet) {
      return res.status(404).jsonp(createErrorResponse(404, 'Diet not found'));
    }
    
    res.jsonp(diet);
  } catch (error) {
    console.error('Error in GET /api/v1/diets/:id:', error);
    res.status(500).jsonp(createErrorResponse(500, 'Internal server error'));
  }
});

// POST /api/v1/diets
server.post('/api/v1/diets', (req, res) => {
  try {
    const db = router.db;
    const newDiet = { 
      ...req.body, 
      id: Date.now(),
      isActive: true,
      startDate: req.body.startDate || new Date().toISOString(),
      endDate: req.body.endDate || new Date(Date.now() + req.body.dietDuration * 24 * 60 * 60 * 1000).toISOString(),
      nutritionInfoList: []
    };
    
    // Ensure all meals have IDs
    if (newDiet.meals && Array.isArray(newDiet.meals)) {
      newDiet.meals = newDiet.meals.map(meal => ({
        ...meal,
        id: Date.now() + Math.floor(Math.random() * 1000), // Generate unique ID
        isActive: true,
        tenantId: meal.tenantId || 1,
        nutritionInfoList: []
      }));
    }
    
    db.get('diets').push(newDiet).write();
    
    res.status(201).jsonp({ id: newDiet.id, name: newDiet.name });
  } catch (error) {
    console.error('Error in POST /api/v1/diets:', error);
    res.status(500).jsonp(createErrorResponse(500, 'Internal server error'));
  }
});

// PUT /api/v1/diets/:id
server.put('/api/v1/diets/:id', (req, res) => {
  try {
    const db = router.db;
    const id = Number(req.params.id);
    const diet = db.get('diets')
      .find({ id })
      .value();
    
    if (!diet) {
      return res.status(404).jsonp(createErrorResponse(404, 'Diet not found'));
    }
    
    // Handle removing meals from diet
    if (req.body.mealIdsToRemove && Array.isArray(req.body.mealIdsToRemove) && req.body.mealIdsToRemove.length > 0) {
      console.log(`Removing meals from diet ${id}:`, req.body.mealIdsToRemove);
      
      // Make sure diet.meals exists
      if (!diet.meals) {
        diet.meals = [];
      }
      
      // Filter out meals to remove
      diet.meals = diet.meals.filter(meal => !req.body.mealIdsToRemove.includes(meal.id));
      
      // Also remove these meals from the standalone meals collection if they exist there
      req.body.mealIdsToRemove.forEach(mealId => {
        const exists = db.get('meals').find({ id: mealId }).value();
        if (exists) {
          db.get('meals').remove({ id: mealId }).write();
        }
      });
    }
    
    // Handle adding new meals with proper IDs
    if (req.body.newMealsToAdd && Array.isArray(req.body.newMealsToAdd)) {
      const newMealsWithIds = req.body.newMealsToAdd.map(meal => ({
        ...meal,
        id: Date.now() + Math.floor(Math.random() * 1000), // Generate unique ID
        isActive: true,
        tenantId: meal.tenantId || 1,
        nutritionInfoList: []
      }));
      
      // Add to standalone meals collection
      db.get('meals').push(...newMealsWithIds).write();
      
      // Update the diet's meals array if it exists
      if (!diet.meals) {
        diet.meals = [];
      }
      diet.meals.push(...newMealsWithIds);
    }
    
    const updatedDiet = {
      ...diet,
      ...req.body,
      id // Ensure ID cannot be changed
    };
    
    // Remove temporary properties that shouldn't be stored
    delete updatedDiet.mealIdsToRemove;
    delete updatedDiet.newMealsToAdd;
    
    db.get('diets')
      .find({ id })
      .assign(updatedDiet)
      .write();
    
    res.status(200).send();
  } catch (error) {
    console.error('Error in PUT /api/v1/diets/:id:', error);
    res.status(500).jsonp(createErrorResponse(500, 'Internal server error'));
  }
});

// DELETE /api/v1/diets/:id
server.delete('/api/v1/diets/:id', (req, res) => {
  try {
    const db = router.db;
    const id = Number(req.params.id);
    const exists = db.get('diets')
      .find({ id })
      .value();
    
    if (!exists) {
      return res.status(404).jsonp(createErrorResponse(404, 'Diet not found'));
    }
    
    db.get('diets')
      .remove({ id })
      .write();
    
    res.status(204).send();
  } catch (error) {
    console.error('Error in DELETE /api/v1/diets/:id:', error);
    res.status(500).jsonp(createErrorResponse(500, 'Internal server error'));
  }
});

// MEAL ENDPOINTS

// GET /api/v1/meals
server.get('/api/v1/meals', (req, res) => {
  try {
    const db = router.db;
    const { 
      name, 
      dietId, 
      mealType, 
      mealOrder, 
      startTime, 
      endTime, 
      searchTerm,
      orderBy,
      pageNumber = 1, 
      pageSize = 10 
    } = req.query;
    
    let meals = db.get('meals').value();

    // Apply filters
    if (name) meals = meals.filter(m => m.name.toLowerCase().includes(name.toLowerCase()));
    if (dietId) meals = meals.filter(m => m.dietId === Number(dietId));
    if (mealType) meals = meals.filter(m => m.mealType === Number(mealType));
    if (mealOrder) meals = meals.filter(m => m.mealOrder === Number(mealOrder));
    if (startTime) meals = meals.filter(m => new Date(m.startTime) >= new Date(startTime));
    if (endTime) meals = meals.filter(m => new Date(m.endTime) <= new Date(endTime));
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      meals = meals.filter(m => 
        m.name.toLowerCase().includes(term) || 
        m.description.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    if (orderBy) {
      const [field, direction] = orderBy.split(':');
      meals.sort((a, b) => {
        if (direction === 'desc') {
          return a[field] > b[field] ? -1 : 1;
        }
        return a[field] < b[field] ? -1 : 1;
      });
    }

    // Apply pagination
    const start = (Number(pageNumber) - 1) * Number(pageSize);
    const paginatedMeals = meals.slice(start, start + Number(pageSize));

    const response = {
      items: paginatedMeals,
      totalCount: meals.length,
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize)
    };

    res.jsonp(response);
  } catch (error) {
    console.error('Error in GET /api/v1/meals:', error);
    res.status(500).jsonp(createErrorResponse(500, 'Internal server error'));
  }
});

// GET /api/v1/meals/:id
server.get('/api/v1/meals/:id', (req, res) => {
  try {
    const db = router.db;
    const meal = db.get('meals')
      .find({ id: Number(req.params.id) })
      .value();
    
    if (!meal) {
      return res.status(404).jsonp(createErrorResponse(404, 'Meal not found'));
    }
    
    res.jsonp(meal);
  } catch (error) {
    console.error('Error in GET /api/v1/meals/:id:', error);
    res.status(500).jsonp(createErrorResponse(500, 'Internal server error'));
  }
});

// POST /api/v1/meals
server.post('/api/v1/meals', (req, res) => {
  try {
    const db = router.db;
    const newMeal = { 
      ...req.body, 
      id: Date.now(),
      isActive: true,
      tenantId: req.body.tenantId || 1,
      nutritionInfoList: []
    };
    
    db.get('meals').push(newMeal).write();
    
    res.status(201).jsonp({ id: newMeal.id, name: newMeal.name });
  } catch (error) {
    console.error('Error in POST /api/v1/meals:', error);
    res.status(500).jsonp(createErrorResponse(500, 'Internal server error'));
  }
});

// PUT /api/v1/meals/:id
server.put('/api/v1/meals/:id', (req, res) => {
  try {
    const db = router.db;
    const id = Number(req.params.id);
    const meal = db.get('meals')
      .find({ id })
      .value();
    
    if (!meal) {
      return res.status(404).jsonp(createErrorResponse(404, 'Meal not found'));
    }
    
    const updatedMeal = {
      ...meal,
      ...req.body,
      id // Ensure ID cannot be changed
    };
    
    db.get('meals')
      .find({ id })
      .assign(updatedMeal)
      .write();
    
    res.status(200).send();
  } catch (error) {
    console.error('Error in PUT /api/v1/meals/:id:', error);
    res.status(500).jsonp(createErrorResponse(500, 'Internal server error'));
  }
});

// DELETE /api/v1/meals/:id
server.delete('/api/v1/meals/:id', (req, res) => {
  try {
    const db = router.db;
    const id = Number(req.params.id);
    const exists = db.get('meals')
      .find({ id })
      .value();
    
    if (!exists) {
      return res.status(404).jsonp(createErrorResponse(404, 'Meal not found'));
    }
    
    // Remove from standalone meals array
    db.get('meals')
      .remove({ id })
      .write();
    
    // Also remove from any diet that contains this meal
    const diets = db.get('diets').value();
    for (const diet of diets) {
      if (diet.meals && Array.isArray(diet.meals)) {
        const mealIndex = diet.meals.findIndex(meal => meal.id === id);
        if (mealIndex !== -1) {
          diet.meals.splice(mealIndex, 1);
          db.get('diets')
            .find({ id: diet.id })
            .assign({ meals: diet.meals })
            .write();
        }
      }
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error in DELETE /api/v1/meals/:id:', error);
    res.status(500).jsonp(createErrorResponse(500, 'Internal server error'));
  }
});

// Start server
const port = 5001;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});