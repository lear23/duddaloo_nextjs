✅ Quick and Simple Changes Implemented
1. Category Model (models/Category.ts)

New model for manually storing categories
Fields: name, slug, description
Categories are created manually in /admin/categories
2. Product Model Update (models/Product.ts)

Added: category (string – category ID)
Added: rabatt (boolean – has discount)
Added: discountPercentage (number – discount %)
3. Admin Components

CreateCategoryForm.tsx – Form to create categories
CategoryList.tsx – List of categories
DeleteCategoryButton.tsx – Button to delete categories
4. /admin/categories Page

Form to create categories
List of all categories
Delete buttons
5. Updated Forms

CreateProductForm.tsx – Added category selector and rabatt checkbox with discount %
EditProductForm.tsx – Added category selector and rabatt checkbox with discount %
6. API

GET /api/categories – Gets all categories
GET /api/init – Initializes default "Posters" category
7. Admin Sidebar

Added link to "Manage Categories"
Removed link to campaigns

🚀 How to Use

Initialize – Access /api/init to create the "Posters" category
Create more categories – Go to /admin/categories
When creating/editing a product:

Select a category
Check "🏷️ Rabatt" if it has a discount
Enter the discount %

Done! Simple, fast, and straightforward. 🎯
