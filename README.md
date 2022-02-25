# [Provider] integration

## About the solution

It consists of a Lambda function to be deployed using AWS ECS. This image is based on an AWS official `Node 14.x` Docker image, built specially for deploying on AWS Lambda. The main file is `index.js` and uses the functionalities of `./[provider]` module.

## To build the Docker Image

- Replace every `[provider]` or `provider` reference in the project
- Run `docker build -t [provider]-integration .`

## To test the built image

- To run the container: `sudo docker run -i -p 9000:8080 [provider]-integration`
- After running the container you have to send the following post request (through command line): `curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '[params]'`

## Uploading to AWS ECR

- To set credentials for uploading (first time on the day): `aws ecr get-login-password --region [region] | docker login --username AWS --password-stdin [account-id].dkr.ecr.[region].amazonaws.com`
- To tag image: `docker tag [provider]-integration:latest [account-id].dkr.ecr.[region].amazonaws.com/[provider]-integration:latest`
- Push to AWS ECR: `docker push [account-id].dkr.ecr.[region].amazonaws.com/[provider]-integration:latest`
- After uploading you have to deploy the last image version on the AWS Lambda function.
