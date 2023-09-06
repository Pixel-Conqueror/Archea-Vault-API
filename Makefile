include .env

build:
	docker-compose build && docker-compose up -d

stripe:
	stripe listen --forward-to $(APP_URL)/stripe_hook

stripe-docker:
	docker run --network host --name stripe --rm -it stripe/stripe-cli:latest listen --api-key $(STRIPE_SECRET_KEY) --forward-to host.docker.internal:$(PORT)/stripe_hook

success-stripe:
	docker exec -it stripe stripe trigger payment_intent.succeeded
