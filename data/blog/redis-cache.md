---
title: Redis caching python
url: 'redis-python'
date: 2023-07-21
tags: ['redis', 'python']
#authors: ['Mohammad Anwer']
draft: false
summary: Speeding up python functions using redis
---
import TOCInline from "@/TOCInline";

<TOCInline toc={props.toc} exclude="Overview" toHeading={2} />


## Write through cacheing in python

When building web applications it's common to introduce cacheing to speed up our api responses 
in order to scale. This can become necessary when an api is called frequently and the persistent data layer
is a bottleneck or the particular api has a long-running computation to perform.

There are many options for cacheing. In this article we'll discuss application layer cacheing and using 
read through cache with redis. 

All code written below is available on [Github](https://github.com/mohanwer/fastapi-redis-example). Follow
along there for a complete example with test cases.

## Setting up a redis connection

In order to setup redis in our application, we'll need configure a redis connection that can be imported when needed. Utilize
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
# utils.py

from typing import Any, Optional
import pickle

from server.redis_client import connection_pool


async def get_object(key: str) -> Optional[Any]:
    # get an object from redis based on a key
    redis = connection_pool.get_redis_connection()
    binary_obj = await redis.get(key)
    
    # convert the binary object to a python object using pickle
    return pickle.loads(binary_obj) if binary_obj else None


async def save_object(
    key: str, obj: Any, expire: Optional[int] = 0
) -> None:
    redis = connection_pool.get_redis_connection()
    
    # convert a python object to binary
    binary_object = pickle.dumps(obj)
    if expire:
        # if we have an expiration passed in, set it so redis will 
        # automatically remove the object
        await redis.setex(key, expire, binary_object)
    else:
        # if there is no expiration, save the object indefinitely
        # be careful with this as you will have to manage removing 
        # this object from cache and run the risk
        # of running out of space in redis if done poorly.
        await redis.set(key, binary_object)

```
## Writing a generalized `read_through_cache` function
Read through cache works by checking the cache to see if data exists. If it does exist, we return it. Otherwise,
the data is retrieved, cached, and a value is returned.

In order to achieve this, we can build a generalized solution. Specifically, using a python decorator. With the example
we can decorate any function that returns data that can be uniquely identified using a key.
```python
# utils.py (extended from above)

import functools
from typing import Any, Callable

def read_through_cache(
    key_name: str, 
    expires_in_seconds: int
) -> Callable[..., Callable]:
    """
    key_name -  The name of key on the wrapped function. Ex: 'key / id'
    expires_in_seconds - TTL for key in redis
    """
    
    def decorator(f: Callable) -> Callable:  
    """
    A function that accepts another function as an argument. 
    Reference link below for a detail explanation:
    https://www.geeksforgeeks.org/decorators-in-python/
    """    
    
        @functools.wraps(f)
        async def wrapper(
            *args: Any,
            **kwargs: Any,
        ) -> Any:
            
            # Extract the key that will be used in redis store the object.
            key = kwargs[key_name]
            # check Redis if the key has a value assigned
            cached_value = await get_object(key)
            if cached_value:
                # if there is data return it as opposed to calling function (f)
                return cached_value

            # if no cache exists, call the function (f)
            if asyncio.iscoroutinefunction(f):
                # in case of async environment, check if this is an awaitable function
                # and call it using async patterns
                res = await f(*args, **kwargs)
            else:
                res = f(*args, **kwargs)

            # save the results in redis of the function
            await save_object(
                key=key, obj=res, expire=expires_in_seconds
            )
            
            # return our function (f) result
            return res

        return wrapper

    """
    Return the wrapped/decorated function.
    Note that this is not returning the result of the function. 
    It is returning an instance of the newly decorated function
    """
    return decorator


@read_through_cache(key_name='my_id_key', expires_in_seconds=2)
def _example_decorator_usage(my_id_key: int, other_kwarg: str) -> int:
    # an implementation example of `read_through_cache`
    return my_id_key + 1
```


## `read_through_cache` Arguments deep dive
Due to the abstract nature of this function, we'll go over the arguments passed into the decorator.

This function accepts a `key_name` argument. The `key_name` value is used to identify the name of the kwarg we want use
as the redis cache key. This value is commonly `id` or `key`. The `read_through_cache` function is written to only be 
concerned with the `key_name` kwarg and if additional kwargs are provided, they function will simply forward them to 
the underlying function.

The second argument is the `expires_in_seconds`. With redis, we can set an expiration so that redis will automatically 
remove the key from memory. This is extremely important because we don't want the cache to grow indefinitely in size.
Redis will passively, in the background, eject keys within 1 millisecond of expiration. Redis also has an active 
expiration process: if a key is retrieved that is expired, it will be ejected.

Reference the code snippet as an implementation example:

```python
@read_through_cache(key_name='my_id_key', expires_in_seconds=2)
def _example_decorator_usage(my_id_key: int, other_kwarg: str) -> int:
    return my_id_key + 1
```
