#!/usr/bin/make -f

SHELL := /bin/bash


production-image:
	source .docker \
	   && docker build \
	         -t translate/xtle \
		 --build-arg BUILD_IMAGE="production" \
		 --build-arg APP_NAME="$$APP_NAME" \
		 --build-arg APP_USERNAME="$$APP_USERNAME" \
		 --build-arg APP_ROOT="$$APP_ROOT" \
		 --build-arg NODE_VERSION="$$NODE_VERSION" \
		 --build-arg NPM_PKGS="$$NPM_PKGS" \
		 --build-arg EGGS="$$EGGS" \
		 --build-arg APP_INIT="python manage.py build" \
		 --build-arg BUILD_PKGS="$$BUILD_PKGS" \
		 --build-arg SYSTEM_PKGS="$$SYSTEM_PKGS" \
		 --build-arg APP_CONFIG="$$APP_CONFIG" \
		github.com/phlax/docker-app#master:context


dev-image:
	source .docker \
	   && docker build \
	         -t translate/xtle:dev \
		 --build-arg BUILD_IMAGE="dev" \
		 --build-arg APP_NAME="$$APP_NAME" \
		 --build-arg APP_USERNAME="$$APP_USERNAME" \
		 --build-arg NODE_VERSION="$$NODE_VERSION" \
		 --build-arg EGGS="$$DEV_EGGS" \
		 --build-arg BUILD_PKGS="$$BUILD_PKGS" \
		 --build-arg SYSTEM_PKGS="$$SYSTEM_PKGS" \
	      	 --build-arg APP_PKGS="$$DEV_PKGS" \
		 --build-arg APP_CONFIG="$$APP_CONFIG" \
		github.com/phlax/docker-app#master:context


docker-pull:
	docker pull translate/xtle > /dev/null && echo "Pulled image translate/xtle" || echo "Image does not exist: translate/xtle"
	docker pull translate/xtle:dev > /dev/null && echo "Pulled image translate/xtle:dev" || echo "Image does not exist: translate/xtle:dev"


docker-push:
	docker push translate/xtle
	docker push translate/xtle:dev
	docker push translate/postgres-xtle-demo
	docker push translate/elasticsearch-xtle-demo


demo:
	docker-compose pull -q postgres elasticsearch
	docker-compose up --no-start postgres elasticsearch
	docker commit `docker-compose  ps -q postgres` translate/postgres-xtle-demo
	docker commit `docker-compose  ps -q elasticsearch` translate/elasticsearch-xtle-demo
	docker-compose up -d postgres-demo elasticsearch-demo
	sleep 5
	docker-compose run demo run_shell python manage.py initdb --migrate --demo-users
	sleep 5
	docker commit `docker-compose  ps -q postgres-demo` translate/postgres-xtle-demo
	docker commit `docker-compose  ps -q elasticsearch-demo` translate/elasticsearch-xtle-demo


hub-images: dev-image production-image demo docker-push
