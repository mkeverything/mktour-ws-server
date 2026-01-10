.PHONY: build push deploy clean help

# Load environment variables from .env file
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# Default Variables
DOCKER_IMAGE := sukalov/mktour
DOCKER_TAG := latest
PLATFORM := linux/amd64
# SERVICE_NAME can be overridden
SERVICE_NAME := mktour-ws

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build Docker image locally for target platform
	@echo "Building Docker image $(DOCKER_IMAGE):$(DOCKER_TAG) for $(PLATFORM)..."
	docker buildx build --platform $(PLATFORM) -t $(DOCKER_IMAGE):$(DOCKER_TAG) --load .
	@echo "Build complete!"

push: ## Build and push Docker image to Docker Hub
	@echo "Building and pushing Docker image to Docker Hub for $(PLATFORM)..."
	docker buildx build --platform $(PLATFORM) -t $(DOCKER_IMAGE):$(DOCKER_TAG) --push .
	@echo "Push complete!"

# Internal generic deployment logic
_deploy_logic:
	@echo "========================================"
	@echo "Deploying $(SERVICE_NAME) with tag $(DOCKER_TAG)..."
	@echo "========================================"
	@echo "1. Building and pushing Docker image..."
	docker buildx build --platform $(PLATFORM) -t $(DOCKER_IMAGE):$(DOCKER_TAG) --push .
	@echo "2. Pulling latest image on remote server..."
	ssh $(REMOTE_HOST) "docker pull $(DOCKER_IMAGE):$(DOCKER_TAG)"
	@echo "3. Stopping and removing old container (if exists)..."
	ssh $(REMOTE_HOST) "docker compose stop $(SERVICE_NAME) || true"
	ssh $(REMOTE_HOST) "docker compose rm -f $(SERVICE_NAME) || true"
	@echo "4. Starting new container..."
	ssh $(REMOTE_HOST) "docker compose up -d $(SERVICE_NAME)"
	@echo "5. Cleaning up old images..."
	ssh $(REMOTE_HOST) "docker image prune -f"
	@echo "6. Checking container status..."
	ssh $(REMOTE_HOST) "docker ps | grep $(SERVICE_NAME)"
	@echo "Deployment of $(SERVICE_NAME) complete!"
	@echo ""

deploy-main: ## Deploy Main version
	$(MAKE) _deploy_logic DOCKER_TAG=latest SERVICE_NAME=mktour-ws

deploy-beta: ## Deploy Beta version
	$(MAKE) _deploy_logic DOCKER_TAG=beta SERVICE_NAME=mktour-ws-beta

deploy: ## Deploy BOTH Main and Beta versions
	@echo "Starting combined deployment..."
	$(MAKE) deploy-main
	$(MAKE) deploy-beta
	@echo "All deployments complete!"

clean: ## Remove local Docker images
	@echo "Removing local Docker image..."
	docker rmi $(DOCKER_IMAGE):$(DOCKER_TAG) || true
	@echo "Cleaning up dangling images..."
	docker image prune -f
	@echo "Clean complete!"

logs: ## Show logs from remote container
	ssh $(REMOTE_HOST) "docker logs -f $(CONTAINER_NAME)"

status: ## Check status of remote container
	@echo "Container status on remote server:"
	ssh $(REMOTE_HOST) "docker ps -a | grep $(CONTAINER_NAME)"
	@echo ""
	@echo "Recent logs:"
	ssh $(REMOTE_HOST) "docker logs --tail 20 $(CONTAINER_NAME)"

restart: ## Restart remote container without rebuilding
	@echo "Restarting container on remote server..."
	ssh $(REMOTE_HOST) "docker compose restart $(SERVICE_NAME)"
	@echo "Restart complete!"
