#!/bin/bash
# chmod +x commands.sh
# bash ./commands.sh

echo "Here is terminal script to add sample data into database"

echo "Add sample data for api gateway"

docker cp ./api-gateway/database/ apiGatewayDB:/data/

docker exec apiGatewayDB mongoimport --host apiGatewayDB --db api-gateway --collection roles --type json --file /data/database/roles.json --jsonArray

docker exec apiGatewayDB mongoimport --host apiGatewayDB --db api-gateway --collection accounts --type json --file /data/database/accounts.json --jsonArray

docker exec apiGatewayDB mongoimport --host apiGatewayDB --db api-gateway --collection users --type json --file /data/database/users.json --jsonArray

# Order

docker cp ./order-service/database/ orderDB:/data/

docker exec orderDB mongoimport --host orderDB --db order --collection areas --type json --file /data/database/areas.json --jsonArray --port 27018

docker exec orderDB mongoimport --host orderDB --db order --collection categories --type json --file /data/database/categories.json --jsonArray --port 27018

docker exec orderDB mongoimport --host orderDB --db order --collection menus --type json --file /data/database/menus.json --jsonArray --port 27018

docker exec orderDB mongoimport --host orderDB --db order --collection printers --type json --file /data/database/printers.json --jsonArray --port 27018

docker exec orderDB mongoimport --host orderDB --db order --collection orders --type json --file /data/database/orders.json --jsonArray --port 27018

exit 0