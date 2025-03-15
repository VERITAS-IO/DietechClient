import fs from 'fs';

// Read the db.json file
const dbPath = './src/mocks/db.json';
try {
  const data = fs.readFileSync(dbPath, 'utf8');
  const db = JSON.parse(data);
  
  let updatedCount = 0;
  
  // Update meals in diets
  if (db.diets) {
    db.diets.forEach(diet => {
      if (diet.meals && Array.isArray(diet.meals)) {
        diet.meals.forEach((meal, index) => {
          if (!meal.id) {
            meal.id = Date.now() + index + Math.floor(Math.random() * 1000);
            meal.isActive = true;
            if (!meal.nutritionInfoList) meal.nutritionInfoList = [];
            updatedCount++;
            console.log(`Added ID ${meal.id} to meal "${meal.name}" in diet ${diet.id}`);
          }
        });
      }
    });
  }
  
  // Write the updated db.json file
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Updated ${updatedCount} meals in diets with new IDs`);
} catch (error) {
  console.error('Error updating db.json:', error);
} 