build:
	docker build -t kotasko-client .
run: 
	docker run -dp 3000:3000 --rm --network kotasko --name kotasko-client kotasko-client:latest
stop:
	docker stop kotasko-client