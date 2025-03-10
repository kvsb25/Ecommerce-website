const Redis = require("redis");
const redisClient = Redis.createClient();
const { DEFAULT_EXPIRATION } = require("../constants/redis.js");

redisClient.on("error", (err) => console.error("Redis Error:", err));

(async () => {
    await redisClient.connect();
    console.log("Connected to Redis.");
})();

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
        console.error("Redis error: ", err);
    }
}

module.exports.setCache = async (key, value)=>{
    try{
        await redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(value));
    } catch(err) {
        console.error("Redis error: ", err);
    }
}