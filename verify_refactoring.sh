echo "BookNook Refactoring Verification"
echo ""

if [ -d "server" ]; then
  echo "server/ folder still exists"
else
  echo "server/ folder removed"
fi


echo ""
echo "Backend Structure"

directories=(
  "backend/src/repositories"
  "backend/src/services"
  "backend/src/controllers"
)

for dir in "${directories[@]}"; do
  if [ -d "$dir" ]; then
    echo "$dir exists"
  else
    echo "$dir missing"
  fi
done

echo ""
echo "Backend Files"

files=(
  "backend/src/repositories/userRepository.js"
  "backend/src/repositories/bookRepository.js"
  "backend/src/services/authService.js"
  "backend/src/services/bookService.js"
  "backend/src/services/adminService.js"
  "backend/src/controllers/authController.js"
  "backend/src/controllers/bookController.js"
  "backend/src/controllers/adminController.js"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "$file exists"
  else
    echo "$file missing"
  fi
done


echo ""
echo "Frontend Structure"

if [ -d "frontend/src/components" ]; then
  echo "frontend/src/components/ exists"
else
  echo "frontend/src/components/ missing"
fi


echo ""
echo "Frontend Components"

components=(
  "frontend/src/components/AuthPanel.jsx"
  "frontend/src/components/RegisterForm.jsx"
  "frontend/src/components/LoginForm.jsx"
  "frontend/src/components/UserHeader.jsx"
  "frontend/src/components/BooksSection.jsx"
  "frontend/src/components/BookForm.jsx"
  "frontend/src/components/BookList.jsx"
  "frontend/src/components/AdminPanel.jsx"
)

for component in "${components[@]}"; do
  if [ -f "$component" ]; then
    echo "$component exists"
  else
    echo "$component missing"
  fi
done

echo ""
echo "Verification Complete"
