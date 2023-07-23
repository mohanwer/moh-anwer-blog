---
title: Redis caching python
url: 'redis-python'
date: 2016-03-08
tags: ['redis', 'python']
#authors: ['Mohammad Anwer']
draft: false
summary: Scaling using cacheing
---
import TOCInline from "@/TOCInline";

<TOCInline toc={props.toc} exclude="Overview" toHeading={2} />

## Cacheing in python

When building web applications it's common to introduce cacheing to speed up our api responses 
in order to scale. This can become necessary when an api is called frequently and the persistent data layer
is a bottleneck or the particular api has a long running computation to perform.

There are many options for cacheing. In this article we'll discuss application layer cacheing and use 
redis. 

## Setting up a redis connection

In order to setup redis in our application, we'll need setup a redis connection that can be imported when needed. Utilize
`start_redis_connection_pool` to have a persistent connection pool while the web application is running.

```python 
# redis_connection.py

from typing import Optional

from redis import asyncio

# thread safe global connection pool
_REDIS_CONNECTION_POOL: Optional[asyncio.ConnectionPool] = None


def start_redis_connection_pool() -> None:
    # Intended to be called during the application startup process
    global _REDIS_CONNECTION_POOL
    if not _REDIS_CONNECTION_POOL:
        _REDIS_CONNECTION_POOL = asyncio.ConnectionPool()

        
async def disconnect_from_redis() -> None:
    # Called during application shutdown
    if _REDIS_CONNECTION_POOL:
        await _REDIS_CONNECTION_POOL.disconnect()

def get_connection_pool() -> asyncio.ConnectionPool:
    if not _REDIS_CONNECTION_POOL:
        start_redis_connection_pool()
    return _REDIS_CONNECTION_POOL


def get_redis_connection() -> asyncio.Redis:
    conn = get_connection_pool()
    return asyncio.Redis(
        connection_pool=conn,
        auto_close_connection_pool=False,
    )
```

## Utility functions for saving and deleting python objects in redis
We'll need to read/write to redis. We can create general functions to save. We can save our python
objects using the pickle library. Some developers may choose to serialize/deserialize json objects as an
alternative.

```python
# redis_utils.py

from typing import Any, Optional
import pickle

import redis_connection

async def get_object(key: str) -> Optional[Any]:
    # get an object from redis based on a key
    redis = redis_connection.get_redis_connection()
    binary_obj = await redis.get(key)
    
    # convert the binary object to a python object using pickle
    return pickle.loads(binary_obj) if binary_obj else None


async def save_object(
    key: str, obj: Any, expire: Optional[int] = 0
) -> None:
    redis = redis_connection.get_redis_connection()
    
    # convert a python object to binary
    binary_object = pickle.dumps(obj)
    if expire:
        # if we have an expiration passed in, set it so redis will automatically remove the object
        await redis.setex(key, expire, binary_object)
    else:
        # if there is no expiration, save the object indefinitely
        # be careful with this as you will have to manage removing this object from cache and run the risk
        # of running out of space in redis if done poorly.
        await redis.set(key, binary_object)

```
## Choosing a cache strategy

### Read through cache
Read through cache works by checking the cache to see if data exists. If it does exist, we return it. Otherwise,
the data is retrieved, cached, and a value is returned.

In order to achieve this, we can build a generalized solution. Specifically, a python decorator.
```python
# redis_util.py

import functools
from typing import Any, Callable
import redis_utils

def read_through_cache(
    key_name: str, expires_in_seconds: int
) -> Callable[..., Callable]:
    def decorator(f: Callable) -> Callable:
        @functools.wraps(f)
        async def wrapper(
            *args: Any,
            **kwargs: Any,
        ) -> Any:
            key = kwargs[key_name]
            cached_value = await redis_utils.get_object(key)
            if cached_value:
                return cached_value

            if asyncio.iscoroutinefunction(f):
                res = await f(*args, **kwargs)
            else:
                res = f(*args, **kwargs)

            await redis_utils.save_object(
                key=key, obj=res, expire=expires_in_seconds
            )
            return res

        return wrapper

    return decorator
```