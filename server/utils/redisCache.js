const Redis = require("redis");
const redisClient = Redis.createClient();
const { DEFAULT_EXPIRATION } = require("../constants/redis.js");

redisClient.on("error", (err) => console.error("Redis Error:", err));

(async () => {
    await redisClient.connect();
    console.log("Connected to Redis.");
})();

// key is by which the data is stored in the cache, and cb is the function that fetches the data if it is not in the cache
// This function will check if the data is in the cache, if it is, it will return it, if not, it will call the cb function to get the data and store it in the cache
module.exports.getOrSetCache = async (key, cb) => {
    try {
        console.log(key);
        const data = await redisClient.get(key);
        
        console.log((data) ? `data: ${data}` : "Cache Miss");

        if (data != null) return (JSON.parse(data));
        
        const freshData = await cb();
        
        console.log((freshData) ? `fresh data: ${freshData}` : "Cache Hit")
        
        await redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
        return freshData;
    } catch (err) {
        // console.error("Redis error: ", err);
        throw new Error(`Redis err: ${err}`);
    }
}

module.exports.setCache = async (key, value)=>{
    try{
        await redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(value));
    } catch(err) {
        // console.error("Redis error: ", err);
        throw new Error(`Redis err: ${err}`);
    }
}

module.exports.fetchDetails = async (key, user, callback) => {
    const details = await this.getOrSetCache(key, () => callback(user));
    return details[0];
}