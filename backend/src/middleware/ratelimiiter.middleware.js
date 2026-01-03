import redis from "../lib/redis.js";

export function fixedWindowRateLimitter(keyGenerator, windowSeconds, maxRequest){
    return async function(req, res, next){

        try{
            const identifier = keyGenerator(req);
            //if identifier is missing then allow next function to be called
            if(!identifier) return next();

            const key = `rate-limit:${identifier}`;
            //get the current number of request
            const numberOfRequest = await redis.incr(key);
            //for first reuqest set the timer which will remove the key if not updated again
            if(numberOfRequest==1){
                await redis.expire(key, windowSeconds);
            }

            if(numberOfRequest>maxRequest){
                const timeLeft = await redis.ttl(key);
                res.setHeader("Retry-After", timeLeft);

                return res.status(429).json({
                    message: "Too many request",
                    retryAfter: `${timeLeft}s`
                });
            }

            next();
        }catch(error){
            console.error("Rate limiter error", error);
            next();
        }
        
    }
}

//create ratelimiter using IP
export const ipRateLimitter = fixedWindowRateLimitter((req)=>req.ip, 15*60, 100);
//create ratelimiter using user id
export const userIdRateLimitter = fixedWindowRateLimitter((req)=>req.user._id, 15*60, 100);