curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"xyz","password":"xyz"}' \
  http://localhost:3000/api/login

  curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"admin","email":"admin@com.com","password":"qwerty12"}' \
  http://localhost:3000/api/users/signup