import pkg from 'json-server';
const { create, router: _router, defaults } = pkg;

const server = create();
const router = _router('db.json');
const middlewares = defaults();

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

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

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
    const nutritionInfos = db.get('nutrition-info-details');
    const existingIds = nutritionInfos.map('id').value();
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    
    const newNutritionInfo = {
      ...req.body,
      id: newId,
      tenantId: 1, // Consider making this dynamic based on authentication
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString()
    };
    
    nutritionInfos.push(newNutritionInfo).write();
    
    res.status(201).jsonp(newNutritionInfo);
  } catch (error) {
    console.error('Error in POST /api/v1/nutrition-info:', error);
    res.status(500).jsonp(createErrorResponse(500, 'Internal server error'));
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

// Start server
const port = 5001;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});