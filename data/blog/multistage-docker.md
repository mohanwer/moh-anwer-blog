---
title: Creating a docker image for fastapi
url: 'multistage-docker'
date: 2023-07-23
tags: ['docker', 'python', 'fastapi']
#authors: ['Mohammad Anwer']
draft: false
summary: A guide for creating a docker image for a FastApi
---
import TOCInline from "@/TOCInline";

<TOCInline toc={props.toc} exclude="Overview" toHeading={2} />

### A guide for creating a docker image for a FastApi
Docker is used in modern web applications to build our apps in a virtualized environment. This article describes how to 
build and test a python [FastApi](https://fastapi.tiangolo.com/) applications using docker. 

### Github Link
A complete example of a project exists on [Github](https://github.com/mohanwer/fastapi-redis-example).

### Dockerfile
The dockerfile contains all the instructions to construct a virtual image containing our web application. The 
[docker file](https://github.com/mohanwer/fastapi-redis-example/blob/master/Dockerfile) is generally at the root 
of projects.

Below is a dockerfile we'll step through one section a time:
```dockerfile
FROM python:3.11 as base

RUN pip install poetry==1.5
WORKDIR app/
COPY poetry.lock pyproject.toml ./
RUN poetry install --no-interaction --no-ansi --no-dev
COPY server server/

FROM base as tests
COPY tests tests/
RUN poetry install --no-interaction --no-ansi
CMD poetry run pytest tests --color=yes

FROM base as production
CMD uvicorn server.main:app --reload
```

### Instructions
Each line in the example dockerfile begins with a docker instruction. Each of these instructions are cached as layers. 
When docker builds, it will check the cache to see if it needs to rebuild the line. 

### Multi-stage builds
When building applications, we often have slight differences based on environments our application may run in. 
For example, the testing environment in this project has extra dependencies and files. There are common dependencies, 
such as python, that are needed both in production and test environments. We can utilize multi-stage builds to 
optimize our docker builds so that it is not rebuilding common dependencies for each environment.

### 1st stage (base)
The first instruction found in our dockerfile is `FROM python:3.11 as base`. The purpose of this is to pull a pre-made
docker image with python already installed. This saves us from having to do our own python installation. When this image
is pulled, each time docker builds the container, it will retrieve the cached image as opposed to downloading it again.

There is special clause in this line: `as base`. This setups a [build stage](https://docs.docker.com/build/building/multi-stage/#name-your-build-stages).
All the instructions following this line will add to this `base` stage in order to prepare it for future use.

```dockerfile
# get python base image
FROM python:3.11 as base  

# install poetry and set our working directory where our application code goes
RUN pip install poetry==1.5
WORKDIR app/

# copy the lock and toml files and execute poetry install without dev depedencies
COPY poetry.lock pyproject.toml ./
RUN poetry install --no-interaction --no-ansi --no-dev

# copy our app code. notice that we did not copy the test folder
COPY server server/
```

In both the testing/production environment, we would have needed python and the dependencies. 
Instead of re-building the project from scratch for each environment we start off building using the `base` stage. An
Important detail in the `base` stage is that poetry was set to not install development dependencies. We will go into 
the reason for this soon.

Most of our changes in the project will be code changes in the server folder. Each time the source code changes, if we 
are to rebuild the docker image, it will use cache for all the lines preceding `COPY server server/`.
When we utilize `COPY` or `ADD` instructions, docker checks to if any of the files in the directory were changed. For
understanding how docker knows whether files are changed reference the [official documentation](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#leverage-build-cache).

### 2nd stage (tests)
When the `tests` stage builds, we copy the test folder over, re-run poetry install, and execute pytests. 

`RUN poetry install` is executed again in order to install development dependencies such as pytest. These dependencies
are only specific to the test environment. Docker images that are constructed should always be lean as possible.

```dockerfile
FROM base as tests
COPY tests tests/
RUN poetry install --no-interaction --no-ansi
CMD poetry run pytest tests --color=yes
```

### 3rd stage (production)
This is the final and simplest stage. The `base` stage had everything needed for the production build in our case. The
only thing needed was to start the fastapi server.

```dockerfile
FROM base as production
CMD uvicorn server.main:app --reload
```